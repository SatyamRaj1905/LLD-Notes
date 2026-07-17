import { Message } from "../messages/message";
import { User } from "../users/users";
import { generateUUID } from "../util";

export abstract class Chat { // ! Reason why we made this class abstract class, see bottom 
  private chatID: string;
  private members: User[] = [];
  private messages: Message[] = [];

  constructor() {
    this.chatID = generateUUID();
  }

  getId(): string {
    return this.chatID;
  }

  // ! Whenever a message is send you have to add in this chat (so that you can query to get all the messages in future or other things)
  addMessage(newMessage: Message) {
    this.messages.push(newMessage);
  }

  getAllMessages(): Message[] {
    // harshit need to add the code..............
    return this.messages;
  }

  getMembers(): User[] {
    return this.members;
  }

  protected addMembers(newMembers: User) { // ! Reason why this made Protected ->  so that from outside no one can call this ONLY CHILD CLASS (one to one and Group) can call it
    this.members.push(newMembers);
  }

  // ! Idea of ChatName in Group Chat is that All members see the chatName of Group to be same but for one to one maybe i have saved with other name and some else has saved that with other name
  // ! In one to one -> ChatName Different
  // ! In group Chat -> ChatName Same

  abstract getChatName(currentUser: User): string;
}

// ! Why need to create seperate class for One to One and Group Chat -> see Notes.md
export class OneToOneChat extends Chat {
  constructor(users1: User, user2: User) { // One thing is for sure in One to One -> there will be ONLY TWO USERs
    super();
    this.addMembers(users1);
    this.addMembers(user2);
  }

  getChatName(currentUser: User): string {
    const memeber = this.getMembers();  // First Grabbing the member

    const otherUserName = memeber.find((user) => { // Then Searching the member
      return user.getId() != currentUser.getId();  // If iterating over the whole array (basically it has just two entry if we are taking one to one chat) not got id which is same as you yourself that simply means that that user is different (your current id should NOT be there in that array itself) so return true
    });

    return otherUserName.getName();  // Moment you get to know that this is not your id, it is someone else so just get their name
  }
}

export class GroupChat extends Chat {
  constructor(private groupName: string) {
    super();
  }

  getChatName(currentUser: User): string {
    return this.groupName;
  }

  addGroupMemebers(member: User) {
    this.addMembers(member);
  }

  removeGroupMembers(member: User) {
    const members = this.getMembers();
    const memberIndex = members.findIndex(
      (groupMember) => groupMember.getId() === member.getId(),
    );

    if (memberIndex !== -1) { // Simply means if the memeberIndex not equal to 1 (means the memberIndex was found as equal -1 means not found)
      members.splice(memberIndex, 1);  // . .splice(startIndex, Number of elements to remove starting with startIndex [Included])
    }
  } 
}

// * Reason why we made Chat an abstract class ?

// - As properties and methods defined in this class will be used in the one to one and group chat as well
// - so it makes sense to make it abstract class and then inherit these properties and methods to the two types of chat present
