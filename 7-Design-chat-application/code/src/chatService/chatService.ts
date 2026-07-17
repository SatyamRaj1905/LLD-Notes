import { Chat, GroupChat, OneToOneChat } from "../chat/chat";
import { Message } from "../messages/message";
import { User } from "../users/users";
import { generateUUID } from "../util";

export class ChatService {
  // ! Why we created these two map see in the Notes.md file
  private users: Map<string, User> = new Map(); // map of userId and User
  private chats: Map<string, Chat> = new Map(); // map of userId and Chat

  // . Implementing SINGLETON PATTERN here
  // If you will not make SINGLE INSTANCE of ChatService then see the below problem
  // Suppose multiple service objects were allowed
  // const service1 = new ChatService();
  // const service2 = new ChatService();
  // Each would have different maps
  // service1 → usersA, chatsA
  // service2 → usersB, chatsB
  // If a user was created through service1, service2 would not know about that user. A message sent through service2 might therefore fail to find the user or chat.
  // With Singleton -> Both variables reference the same service and therefore the same users and chats.
  static instance: ChatService = null;
  private constructor() {}

  static getInstance(): ChatService { // ! Main way to know Singleton a static method provides access to the instance
    if (this.instance == null) {
      this.instance = new ChatService(); // . First call creates the instance. Every later call returns the same instance.
    }
    return this.instance;
  }

  // Below three methods are just for the removal of creation of user and chat type in server.ts
  createUser(userName: string, contact: string) {
    const newUser = new User(generateUUID(), userName, contact);
    this.users.set(newUser.getId(), newUser); // Once user is created push it into Map users

    return newUser;
  }

  createOneOneChat(user1: User, user2: User) {
    const newChat = new OneToOneChat(user1, user2);
    this.chats.set(newChat.getId(), newChat); // OneToOnechat made so push it in Map chats

    return newChat;
  }

  createGroupChat(groupName: string) {
    const newGroup = new GroupChat(groupName);
    this.chats.set(newGroup.getId(), newGroup); // Groupchat made so push it in Map chats

    return newGroup;
  }

  // If Lets say Harshit wants to send message "HI" to rahul what all things are required
  // 1. message content
  // 2. Sender
  // 3. To which Type of Chat as well
  // 4. Ignore Reciever as in onetoone there is one reciever but for groupChat there are many recievers
  sendMessage(senderId: string, chatId: string, content: string) {
    const sender = this.users.get(senderId);  // ! Fetch this from map created above
    const chat = this.chats.get(chatId); // ! Fetch this from map created above

    const message = new Message(generateUUID(), sender, content, chat);
    chat.addMessage(message); // So that you can STORE the information in chat so that user can be able to see all the messages

    const members = chat.getMembers();
    for (let user of members) {
      if (user.getId() != sender.getId()) { // sends the message to everyone except the sender (sender should not recieve itself, it should just see it which we have already done above)
        user.getMessage(message);
      }
    }

    return message;
  }

  getHistory(chatId: string) {
    const chat = this.chats.get(chatId);

    const messageHistory = chat.getAllMessages();
    console.log(messageHistory);
  }
}
