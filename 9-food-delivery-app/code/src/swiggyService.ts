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


  // ! Implementing SINGLETON PATTERN here
  private constructor() {} // ! Made constructor private so that this class cannot be called from outside otherwise everyone will be able to create or delete customers, restro, or deliveryAgents 

  static getInstance(): SwiggyService {
    if (SwiggyService.instance == null) {
      SwiggyService.instance = new SwiggyService();
    }
    return SwiggyService.instance;
  } // till here did singleton class implementation

  // Implemented method to create observers present in this
  createCustomers(name: string, phone: string) { 
    const newCustomer = new Customer(crypto.randomUUID(), name, phone); // as each customer needs name, phone and email[see the class for the customer] (email is default to null so not required to pass here)
    this.customers.set(newCustomer.getId(), newCustomer);
    return newCustomer;
  }
  createDeliveryAgents(name: string, phone: string) {
    const newDelivery = new DeliveryAgent(crypto.randomUUID(), name, phone); // same explanation as customer
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
    discountS?: IDiscount,  // Its optional as you may get or may not get
  ) {
    const customer = this.customers.get(customerId);
    const restro = this.restros.get(restroId);

    const cartItems = customer.getCart(); // As each user has it own cart information stored inside addToCart (see inside users.ts)

    // calculate amount before discount
    const amountBeforeDiscount = cartItems.reduce((sum, cartItem) => {
      return sum + cartItem.getItem().getPrice() * cartItem.getQuantity();  // cartItem class contains MenuItem (item : MenuItem) and quantity and MenuItem itself contains Price 
    }, 0);  // so cartItem.getItem gives particular MenuItem and then further .getPrice will give price of that Item,
    // Multiplying with quantity will give me the amount user should pay before discount

    const amountAfterDiscount = discountS
      ? discountS.applyDiscount(amountBeforeDiscount)
      : amountBeforeDiscount; // Just wrote a conditional statement is discountS is true then applyDiscount on the above price otherwise give the user same price before discount

    // Logic for the payement
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
      

      // Stored or saved orders inside the map
      this.orders.set(order.getId(), order);
      customer.addorderHistory(order); // and then showed or saved it inside the customer and restro
      restro.addOrderToHistory(order);

      this.updateStatus(order.getId(), OrderStatus.PENDING);

      return order;
    } else {
      throw Error("payment got failed..., Order not placed");
    }
  }

  cancelOrder(orderId: string) {
    const order = this.orders.get(orderId);  // First got the order from the stored map named as "orders"
    if (order.getStatus() != OrderStatus.PENDING) { // ! If the orderstatus is in pending then only its possible to cancel the order, otherwise not possible
      throw new Error("Order not be cancelled because it's already confirmed");
    }
    order.changeOrderStatus(OrderStatus.CANCELLED); // If in pending then simply change the orderStatus to CANCELLED 
    const paymentS = order.getPaymentStrategy();  // For the refund process, first grabbed the paymentStrategy from Order as Order class has method to get paymentStrategy
    paymentS.refund(order.getNetAmountAfterDiscount());  // then as all paymentStrategy have refund logic written so just call it
  }

  assignOrderToDeliveryAgent(orderID: string, deliveryAgentId: string) {
    const order = this.orders.get(orderID);  // Fetching from the map created "orders"
    const deliveryAgent = this.deliveryAgents.get(deliveryAgentId);
    order.assignDeliverAgent(deliveryAgent);
  }

  updateStatus(orderId: string, newStatus: OrderStatus) {
    const order = this.orders.get(orderId); // Fetching from the map created "orders" 
    order.changeOrderStatus(newStatus);
  }
}
