import { Address } from "./address/address";
import { IDiscount } from "./discount/discount";
import { OrderStatus, PaymentStatus } from "./enum";
import { Order } from "./order/order";
import { IPayment } from "./payment/payment";
import { Menu } from "./restro/menu/menu";
import { Restro } from "./restro/restaurants/restro";
import { Customer, DeliveryAgent } from "./users/users";

export class SwiggyService {
  static instance: SwiggyService;
  private customers: Map<string, Customer> = new Map();
  private deliveryAgents: Map<string, DeliveryAgent> = new Map();
  private restros: Map<string, Restro> = new Map();
  private orders: Map<string, Order> = new Map();

  private constructor() {}

  static getInstance(): SwiggyService {
    if (SwiggyService.instance == null) {
      SwiggyService.instance = new SwiggyService();
    }
    return SwiggyService.instance;
  }

  createCustomers(name: string, phone: string) {
    const newCustomer = new Customer(crypto.randomUUID(), name, phone);
    this.customers.set(newCustomer.getId(), newCustomer);
    return newCustomer;
  }
  createDeliveryAgents(name: string, phone: string) {
    const newDelivery = new DeliveryAgent(crypto.randomUUID(), name, phone);
    this.deliveryAgents.set(newDelivery.getId(), newDelivery);
    return newDelivery;
  }
  createRestro(name: string, address: Address) {
    const newRestro = new Restro(crypto.randomUUID(), name, address);
    this.restros.set(newRestro.getId(), newRestro);
    return newRestro;
  }

  makeOrder(
    customerId: string,
    restroId: string,
    paymentS: IPayment,
    discountS?: IDiscount,
  ) {
    const customer = this.customers.get(customerId);
    const restro = this.restros.get(restroId);

    const cartItems = customer.getCart();

    // calculate amount before discount
    const amountBeforeDiscount = cartItems.reduce((sum, cartItem) => {
      return sum + cartItem.getItem().getPrice() * cartItem.getQuantity();
    }, 0);

    const amountAfterDiscount = discountS
      ? discountS.applyDiscount(amountBeforeDiscount)
      : amountBeforeDiscount;

    const paymentStatus = paymentS.pay(amountAfterDiscount);
    if (paymentStatus == PaymentStatus.COMPLETED) {
      const order = new Order(
        crypto.randomUUID(),
        customer,
        restro,
        amountBeforeDiscount,
        amountAfterDiscount,
        cartItems,
        paymentS,
        discountS,
      );

      //   console.log(restroId);
      //   console.log(restro);

      this.orders.set(order.getId(), order);
      customer.addorderHistory(order);
      restro.addOrderToHistory(order);

      this.updateStatus(order.getId(), OrderStatus.PENDING);

      return order;
    } else {
      throw Error("payment got failed..., Order not placed");
    }
  }

  cancelOrder(orderId: string) {
    const order = this.orders.get(orderId);
    if (order.getStatus() != OrderStatus.PENDING) {
      throw new Error("Order not be cancelled because it's already confirmed");
    }
    order.changeOrderStatus(OrderStatus.CANCELLED);
    const paymentS = order.getPaymentStrategy();
    paymentS.refund(order.getNetAmountAfterDiscount());
  }

  assignOrderToDeliveryAgent(orderID: string, deliveryAgentId: string) {
    const order = this.orders.get(orderID);
    const deliveryAgent = this.deliveryAgents.get(deliveryAgentId);
    order.assignDeliverAgent(deliveryAgent);
  }

  updateStatus(orderId: string, newStatus: OrderStatus) {
    const order = this.orders.get(orderId);
    order.changeOrderStatus(newStatus);
  }
}
