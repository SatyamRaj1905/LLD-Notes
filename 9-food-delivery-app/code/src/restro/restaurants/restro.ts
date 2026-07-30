import { Address } from "../../address/address";
import { OrderStatus } from "../../enum";
import { Order, OrderObserver } from "../../order/order";
import { SwiggyService } from "../../swiggyService";
import { Menu } from "../menu/menu";

export class Restro implements OrderObserver {
  constructor(
    private id: string,
    private name: string,
    private adresss: Address,
    private menu: Menu = null, // ! as Each Restro has one Menu card only
    private isAvaialble: boolean = true,
    private orderHistory: any[] = [],
  ) {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  setMenu(menu: Menu) {
    this.menu = menu;
  }

  getMenu(): Menu {
    return this.menu;
  }

  isAvailable(): boolean {
    return this.isAvaialble;
  }

  toggleAvailability() { // ! If you want to make available or unavailable your restro
    this.isAvaialble = !this.isAvaialble;
  }

  addOrderToHistory(order: Order) {
    this.orderHistory.push(order);
  }

  getOrderHistory(): any[] {
    return this.orderHistory;
  }

  // Below functions are not part of the first version, they have been added later
  onOrderStatusChange(order: Order) {
    console.log(`Notifcation for Restro - ${this.getName()}
                  for Order - ${order.getId()}
                  and status - ${order.getStatus()}
      `);
  }

  changeOrderStatus(orderId: string, newStatus: OrderStatus) {
    const swiggyInstance = SwiggyService.getInstance();
    swiggyInstance.updateStatus(orderId, newStatus);
  }
}
