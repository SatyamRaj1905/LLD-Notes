import { IDiscount } from "../discount/discount";
import { OrderStatus } from "../enum";
import { IPayment } from "../payment/payment";
import { MenuItem } from "../restro/menuItem/menuItem";
import { Restro } from "../restro/restaurants/restro";
import { Customer, DeliveryAgent } from "../users/users";

export class CartItem {
  constructor(
    private item: MenuItem,
    private quantity: number,
    private instructions: string = null,
  ) {}

  getItem(): MenuItem {
    return this.item;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getInstructions(): string {
    return this.instructions;
  }
}

// ! Implemented OBSERVER PATTERN
// ! STEP 1 -> The below interface will be implemented by customer and restraunt (not added deliveryAgent, see below point) 
export interface OrderObserver {
  onOrderStatusChange(order: Order): void;
}

// . there are three Observers -> customer, restaurant, and delivery agent
export class Order {
  constructor(
    private id: string,
    private customer: Customer,
    private restaurant: Restro,
    private grossAmount: number, // ! Total amount without discount
    private netAmount: number, // ! After discount this will be the amount
    private items: CartItem[],
    private paymentStrategy: IPayment,
    private discountStrategy: IDiscount,
    private deliveryAgent: DeliveryAgent = null,
    private orderStatus: OrderStatus = null,
    private orderTime: Date = new Date(),
    private deliveredTime: Date = null,
    private observers: OrderObserver[] = [], // ! STEP 2 -> Added list of observers
  ) {
    this.addObservers(this.customer);
    this.addObservers(this.restaurant);
    // * Not added this.addObservors(this.deliveryAgent) as after food order is confirmed, we immediately do not assign any delivery agent, it TAKES TIME
  }

  getId(): string {
    return this.id;
  }
  getCustomer(): Customer {
    return this.customer;
  }
  getRestro(): Restro {
    return this.restaurant;
  }
  getDeliveryAgent(): DeliveryAgent {
    return this.deliveryAgent;
  }
  getItems(): CartItem[] {
    return this.items;
  }
  getStatus(): OrderStatus {
    return this.orderStatus;
  }

  changeOrderStatus(newStatus: OrderStatus) {
    this.orderStatus = newStatus;
    // Below line added after the first version
    this.notifyObservers();
  }
  getNetAmountAfterDiscount() {
    return this.netAmount;
  }
  // ! STEP 3 -> Added or pushed in the list made for all the observers
  addObservers(observer: any) {
    this.observers.push(observer);
  }

  getPaymentStrategy(): IPayment {
    return this.paymentStrategy;
  }

  // After some time, delivery agents will get assigned
  assignDeliverAgent(agent: DeliveryAgent) {
    if (agent.isAgentAvailable()) { // First you will check if the agent is available
      this.deliveryAgent = agent;
      this.addObservers(agent); // now agent is being made as Observer
      agent.addOrderToHistory(this);
    } else { // Or not available
      throw Error("delivery agent is not available");
    }
  }

  // ! Moment the Status of the order changes, you have to notify to all the Observers
  notifyObservers() {
    this.observers.forEach((observer) => observer.onOrderStatusChange(this));
  }
}
