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

  sendMessage(senderId: string, chatId: string, content: string) {
    const sender = this.users.get(senderId);
    const chat = this.chats.get(chatId);

    const message = new Message(generateUUID(), sender, content, chat);
    chat.addMessage(message);

    const members = chat.getMembers();
    for (let user of members) {
      if (user.getId() != sender.getId()) {
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
