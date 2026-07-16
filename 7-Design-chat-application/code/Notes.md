# Design Chat Application

## 1-Requirements

1. User 
    - Create a user
2. One-to-One Chat
    - Send and receive messages
3. Group Chat
    - Create group chat
    - Add and remove members
    - Send and receive messages in a group
4. Message
    - Text message
    - Timestamps
    - React on messages    👍 😂 ✌️ (critical and tricky part not much asked)
5. Online Status
    - Show whether a user is online and offline

## 2- Different Entities we can think of

1. Users
2. Messages
3. Groups
4. Reactions
5. Chat
   - Two Types - 1. One-One and 2. Group Chat

## 3- UML Diagram for the above part


<img src = "uml_chatApplication.png" width=700 height=350>

## 4- Design Chat Application
----------

>[!NOTE]
> <span style="color:brown">**What is the similarity between one to one chat and group chat**</span>
>
>  Message Sending Mechanism, Broadcasting part (in one to one just braodcasting to that person and in group we are broadcasting to all members)


#### <span style="color:orange">**STEP 1**</span> 
----------

First made `User.ts` as that is the easiest kickoff and independent entity

> In the meantime we have also made `utils.ts` (<span style="color:orange">**Just a helper file consisting of some functions that are helpful like generating Random ID**</span>)

#### <span style="color:orange">**STEP 2**</span>
----------

Next will be `Chat.ts` 


Now inside the `Chat.ts`, a very important question arises 

:bulb: <span style="color:brown">**What do you think, should we make two seperate class for One-One Chat and Group Chat or `Chat.ts` can singly handle both the logic ?**</span>

=>   You might think that `Chat.ts` can handle both the logic as we just have to broadcast the message only, just limit the members count = 2 for one to one chat and the moment it exceeds 2 it will become group chat and broadcasting the message will work fine as there are 2 members only in one to one so the broadcasting simply means exactly same as sending the message to other person and case of group chat is already clear

<span style="color:brown">**BUT**</span>

**You forgot some problems that will come with this**

1. In one to one chat, you will end up adding lot of members even
2. In Group chats, we can remove some members also so even if you write some method named as `removeMemebers` in one to one what you will remove ?
3. How you come to know in whatsapp that this Group chat and this is one to one chat
   - Using <span style="color:orange">**NAME**</span> (Groups have some NAME) and one to one have primarily contact number being shown (unless you save that number with some name)


>[!NOTE]
> As class `Chat` has properties and methods which are common to both `OneToOneChat` and `GroupChat` so <span style="color:orange">**making `Chat` class ABSTRACT class**</span> and then <span style="color:orange">**Inheriting the common properties and method to the child class (Onetoone and Group)**</span> is a better way to implement them

```javascript
import {OneToOneChat } from "./src/chat/chat"; 
import { User } from "./src/users/users"; 
import { generateUUID } from "./src/util";

const harshit = new User(generateUID(), "harshit", "99777");
const rahul = new User(generateUUID(), "rahul", "99777");
const aditya = new User(generateUUID(), "aditya", "99777");
const harshit_rahul_11_chat = new OneToOneChat(harshit, rahul);

console.log(harshit_rahul_11_chat.getChatName(harshit));  // Output -> rahul (as it is one to one chat and except harshit, rahul is only 
// there)

const college_group = new GroupChat("college-2016-2020");

college_group.addGroupMemebers (harshit); 
college_group. addGroupMemebers (rahul);
college_group. addGroupMemebers (aditya);

console. log (college_group.getChatName(harshit));  // Output -> college-2016-20202
```

Now  you do the above code in `Server.ts` file just to check whether one to one chat and group chat logic is working or not ?

#### <span style="color:orange">**STEP 3**</span>

----------

Now comes the `message.ts` file

:bulb: <span style="color:brown">**How we are going to implement Seen status ?**</span>

-> Creating a Map which will have Key as Userid (string) and Value as Seen (boolean).

Basically you will store all the userID who have seen the message, the person who are absent from the map simply means they have not seen the message, Its that simple

#### <span style="color:orange">**STEP 5**</span>
----------

Now comes the part `chatService.ts`

This will have all that broadcasting logic of messages

:sparkle: See the below code

```javascript

// Ideally we are$$ making users like this and that too in server.ts file
// 1
const harshit = new User(generateUID(), "harshit", "99777");
const rahul = new User(generateUUID(), "rahul", "99777");
const aditya = new User(generateUUID(), "aditya", "99777");

// and chat like this in server.ts file
// 2
const college_group = new GroupChat("college-2016-2020");
const harshit_rahul_11_chat = new OneToOneChat(harshit, rahul);

```
Now we need a **Database** in practical life to store these Users name and Chats name (group names) but as currently we dont have that hence we are going to store then **InMemory** using `chatService.ts` file and then making <span style="color:green">**Two Maps, one for Users and another for Chats**</span>

<span style="color:brown">**also i dont want to create users and chat like the above part see `//1` and `//2`**</span> and hence i will create <span style="color:orange">**methods like `createUser`, `createOneToOneChat`, `createGroupChat`**</span>

:bulb: <span style="color:brown">**Can you find the limitation of the above approach ?**</span>

-> Though Singleton pattern (which we have implemented also) guarantees one instance only within the current JavaScript process. If the application runs on multiple servers or processes, each process will have its own ChatService instance. A production chat application would generally store users and chats in a shared database rather than relying only on in-memory maps.