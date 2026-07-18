import { Chat } from "../chat/chat";
import { User } from "../users/users";

// decorator interfacce
interface IDecorator {
  getContent(): string;
}

// concreate class
export class Message implements IDecorator {
  constructor(
    private id: string,
    private sender: User,  // Sent by who
    private content: string,
    private chat: Chat, // and Sent to where // ! As that message can be one to one chat or group chat
    private timeStamp: Date = new Date(),
    private seenList: Map<string, boolean> = new Map(), // string for UserId and boolean for Seen
  ) {}

  getId(): string {
    return this.id;
  }

  getSender(): string {
    return this.sender.getName();
  }

  getContent(): string {
    return this.content;
  }

  getChat(): Chat {
    return this.chat;
  }

  getSeenList() {
    return this.seenList;
  }
}

// base decorator is abstraction of decoration
abstract class BaseDecorator implements IDecorator {
  constructor(protected message: IDecorator) {}

  // getContent(): string {
  //   return this.baseObject.getContent() + "❤️ ✌️";
  // }

  abstract getContent(): string;
}

type Reaction = { // used below for the type of reactionList
  emoji: string;
  userId: string;
};

// this is concreate decotion class....
export class ReactionDecoator extends BaseDecorator {
  private reactionList: Reaction[] = [];

  constructor(message: IDecorator) {
    super(message);
  }

  addReaction(emoji: string, userId: string) { // What emoji (emoji) and who send that (userId)
    const alreadyExits = this.reactionList.some( // ! A single user can put multiple reaction only ONE TIME, like i should react with heart only one time, even can give thumbs up one time
      (r) => r.emoji == emoji && r.userId == userId,
    );

    if (!alreadyExits) {
      this.reactionList.push({ emoji, userId });
    }
  }

  // "HI GM" ❤️:2, 👍:4, 👌:1 // This is what we want
  // so getContent will give the message and getReaction will give the reaction
  getReaction(): string { // getting the emoji content
    let summary: Record<string, string[]> = {};  // ! summary currently looks something like this -> ❤️:[userId1, userId3], 👍:[userId2, userId1] and so on..  

    // . Used Record instead of Map as Map does not work with Emojis whereas Record do works
    for (let r of this.reactionList) {
      if (!summary[r.emoji]) {
        summary[r.emoji] = [];
      }
      summary[r.emoji].push(r.userId);
    }

    const emojiKey = Object.keys(summary);
    let content = "";
    emojiKey.map((emoji) => {
      content += emoji + " " + summary[emoji].length + ",";
    });

    return content;
  }

  getContent(): string {
    // "HI GM" (this comes from this.message.getContent()) and ❤️:2, 👍:4, 👌:1 (come from this.getReaction()) as stated below
    return this.message.getContent() + " " + this.getReaction();
  }
}
