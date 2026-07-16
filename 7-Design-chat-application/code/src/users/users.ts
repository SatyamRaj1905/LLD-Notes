import { Message } from "../messages/message";

export class User {
  constructor(
    private id: string,
    private name: string,
    private contact: string,
    private isOnline: boolean = true,
  ) {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getContact(): string {
    return this.contact;
  }

  goOnline() {
    this.isOnline = true; // Initialised with User is Online
  }

  goOffline() {
    this.isOnline = false;
  }

  // ! Each user should expose a function using which anyone can call the user and sends the message and that message should be sent to the user

  getMessage(message: Message) {
    if (this.isOnline) {
      console.log(
        `Notification for ${this.getName()} From 
        ${message.getSender()} 
        and Message is ${message.getContent()}`,
      );
    } else {
      // we can save this message somewhere so when the user will come online we will send all these stored message to user and
      // whenever person is online fetch all the message
    }
  }
}
