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

export interface OrderObserver {
  onOrderStatusChange(order: Order): void;
}

export class Order {
  constructor(
    private id: string,
    private customer: Customer,
    private restaurant: Restro,
    private grossAmount: number,
    private netAmount: number,
    private items: CartItem[],
    private paymentStrategy: IPayment,
    private discountStrategy: IDiscount,
    private deliveryAgent: DeliveryAgent = null,
    private orderStatus: OrderStatus = null,
    private orderTime: Date = new Date(),
    private deliveredTime: Date = null,
    private observers: OrderObserver[] = [],
  ) {
    this.addObservers(this.customer);
    this.addObservers(this.restaurant);
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
    this.notifyObservers();
  }
  getNetAmountAfterDiscount() {
    return this.netAmount;
  }
  addObservers(observer: any) {
    this.observers.push(observer);
  }

  getPaymentStrategy(): IPayment {
    return this.paymentStrategy;
  }
  assignDeliverAgent(agent: DeliveryAgent) {
    if (agent.isAgentAvailable()) {
      this.deliveryAgent = agent;
      this.addObservers(agent);
      agent.addOrderToHistory(this);
    } else {
      throw Error("delivery agent is not available");
    }
  }

  notifyObservers() {
    this.observers.forEach((observer) => observer.onOrderStatusChange(this));
  }
}
