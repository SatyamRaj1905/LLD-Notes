import { Address } from "../address/address";
import { OrderStatus } from "../enum";
import { CartItem, Order, OrderObserver } from "../order/order";
import { SwiggyService } from "../swiggyService";

export abstract class User implements OrderObserver {
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

  abstract onOrderStatusChange(order: Order): void;
}

export class Customer extends User {
  private allAddresses: Address[] = [];
  private currentAddress: Address = null;
  private orderHistory: any[] = [];
  private cart: CartItem[] = [];

  constructor( 
    userId: string,
    name: string,
    phone: string,
    email: string = null,
  ) {
    super(userId, name, phone, email);
  }

  getAllAddresses(): Address[] {
    return this.allAddresses;
  }

  getCurrentAddress(): Address {
    return this.currentAddress;
  }

  getCart(): CartItem[] {
    return this.cart;
  }

  getOrderHistory(): any[] {
    return this.orderHistory;
  }

  addorderHistory(order) {
    this.orderHistory.push(order);
  }

  addAddress(address: Address): void {
    this.allAddresses.push(address);
    if (!this.currentAddress) {
      this.currentAddress = address;
    }
  }
  setCurrentAddress(address: Address): void {
    if (this.allAddresses.includes(address)) {
      this.currentAddress = address;
    } else {
      throw new Error("Address not found in user's address list.");
    }
  }

  addToCart(item: CartItem): void {
    this.cart.push(item);
  }

  // Below function was added after some time, in the first declaration the below one was not present
  onOrderStatusChange(order: Order) {
    console.log(`Notifcation for customer - ${this.getName()}
                for Order - ${order.getId()}
                and status - ${order.getStatus()}
    `);
  }
}

export class DeliveryAgent extends User {
  private isAvailable: boolean = false;
  private deliveryHistory: any[] = [];
  private currentLocation: Address = null;

  constructor(
    userId: string,
    name: string,
    phone: string,
    email: string = null,
  ) {
    super(userId, name, phone, email);
  }

  makeOnline(): void {
    this.isAvailable = true;
  }
  makeOffline(): void {
    this.isAvailable = false;
  }
  isAgentAvailable(): boolean { // ! Before assigning any order to delivery boy, we need to check whethere this boy is available or not
    return this.isAvailable;
  }

  addOrderToHistory(order: Order) {
    this.deliveryHistory.push(order);
  }
  getDeliveryHistory(): any[] {
    return this.deliveryHistory;
  }
  setCurrentAddress(address: Address): void {
    this.currentLocation = address;
  }

  // Below function has been added after the first declaration or version of the delivery agent
  onOrderStatusChange(order: Order) {
    console.log(`Notifcation for Delivery - ${this.getName()}
                for Order - ${order.getId()}
                and status - ${order.getStatus()}
    `);
  }

  changeOrderStatus(orderId: string, newStatus: OrderStatus) {
    const swiggyInstance = SwiggyService.getInstance();
    swiggyInstance.updateStatus(orderId, newStatus);
  }
}

export class RestroAdmin extends User {
  public restaurantId: string;  // ! Imp. Each Restraunt admin is attached to one restrauant
  constructor(
    userId: string,
    name: string,
    phone: string,
    email: string = null,
  ) {
    super(userId, name, phone, email);
  }

  onOrderStatusChange(order: Order) {
    console.log(`Notifcation for Restro - ${this.getName()}
                for Order - ${order.getId()}
                and status - ${order.getStatus()}
    `);
  }
}
