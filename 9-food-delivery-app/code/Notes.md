# **Design Food Delivery App**

## **Steps**

### **Step 1 ->**
----------

starting of with `enum.ts`

### **Step 2 ->**
----------

Now starting with that entity which has <span style="color:orange">**least dependence**</span>

it will be `address.ts` (no dependence at all)

### **Step 3 ->**

Now comes `users.ts`

Now here we are dealing with **3 types of user**
1. Customer
2. Delivery Agents
3. Restro Admin

Above all the types of User have something in common, so **Abstract them**

```javascript
export abstract class User {
  constructor(
    private userId: string,
    private name: string,
    private phone: string,
    private email: string = null,
  ) {}

  getId(): string {
    return this.userId;
  }

  getName(): string {
    return this.name;
  }

  getPhone(): string {
    return this.phone;
  }

  getEmail(): string {
    return this.email;
  } 
}

// Now Applying Abstraction
export class Customer extends User and same with Delivery boy and restro admin
```

>[!TIP]
> Ideally we should make a seperate entity `admin.ts` to handle all the restro related problem and additions but we have declared it in this class to easify things

### **Step 4 ->**
----------

Next we will focus on restraunt operation 

so the chronology goes something like the below

<span style="color:orange">**Each Restrauant will have menu and Each Menu will have Menu Item**</span>

Starting off with making of `MenuItem.ts`

### **Step 5 ->**
----------

Then comes the `Menu.ts` (this is just going to handle all the things related to CRUD operations to be done in `MenuItem` like adding some item, deleting some item from the menu, gatting whole menu and so on...)

### **Step 6 ->**
----------

Finally comes the `Restro.ts` 

### **Step 7 ->**
----------

Before moving on `Order.ts` file logic, lets quickly make `payment.ts` and `discount.ts` as `order.ts` is **dependent on the above two**

so now writing `payment.ts` logic (followed <span style="color:orange">**Strategy Patter**</span>)

### **Step 8 ->**
----------

moving on to `discount.ts` which will also use the <span style="color:orange">**Strategy Pattern**</span>


### **Step 9 ->**
----------

Now we can finally move to `Order.ts` as we have made `payment.ts` and `discount.ts` (there functions and logic will be used in `order.ts` like what the payment strategy ?, what type of discount is being applied ? and so on..)







