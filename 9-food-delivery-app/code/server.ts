import { Address } from "./src/address/address";
import { FlatDiscount } from "./src/discount/discount";
import { OrderStatus } from "./src/enum";
import { CartItem } from "./src/order/order";
import { UPI } from "./src/payment/payment";
import { Menu } from "./src/restro/menu/menu";
import { MenuItem } from "./src/restro/menuItem/menuItem";
import { SwiggyService } from "./src/swiggyService";

const swiggy = SwiggyService.getInstance();  // created the swiggyservice instance first as that has only the logic to create customers, restro and agents

// Will not be using "new" to create objects as we have made swiggyservive singleton class and static type so directly you can call no need for "new" 
const harshit = swiggy.createCustomers("harshit", "9977"); // Created customer "Harshit" and its phone number

const agent1 = swiggy.createDeliveryAgents("agent1", "7788");  // Created two deliveryagents with their phone number
const agent2 = swiggy.createDeliveryAgents("agent1", "7788");

const pista_house = swiggy.createRestro(
  "Pista_House",
  new Address("Hietch", "HYD"), // on the spot created Address
);


// Creating MenuItem
const dosa = new MenuItem(crypto.randomUUID(), "DOSA", 80);
const chickenBiryani = new MenuItem(crypto.randomUUID(), "C:Biryani", 300);
const vegBiryani = new MenuItem(crypto.randomUUID(), "V:Biryani", 200);

// Adding created MenuItem to the newly made Restro (pista_house)
const pistaHouse_menu_card = new Menu();
pistaHouse_menu_card.addMenuItem(dosa);
pistaHouse_menu_card.addMenuItem(chickenBiryani);
pistaHouse_menu_card.addMenuItem(vegBiryani);

// Setting the Menu for the Restro (pista_house)
pista_house.setMenu(pistaHouse_menu_card);

// Now Customer Harshit started to add the Items from this newly made restro
harshit.addToCart(new CartItem(chickenBiryani, 2));
harshit.addToCart(new CartItem(dosa, 3));

// Then the customer places the Order
const order = swiggy.makeOrder(
  harshit.getId(),
  pista_house.getId(),
  new UPI(),
  new FlatDiscount(100),
);

setTimeout(() => {
  pista_house.changeOrderStatus(order.getId(), OrderStatus.CONFIRMED);
}, 1000);

setTimeout(() => {
  pista_house.changeOrderStatus(order.getId(), OrderStatus.PREPARED);
  agent1.makeOnline();
  swiggy.assignOrderToDeliveryAgent(order.getId(), agent1.getId());
}, 2000);

setTimeout(() => {
  pista_house.changeOrderStatus(order.getId(), OrderStatus.READY_FOR_DELIVERY);
}, 3000);

setTimeout(() => {
  agent1.changeOrderStatus(order.getId(), OrderStatus.OUT_FOR_DELIVERY);
}, 6000);

setTimeout(() => {
  agent1.changeOrderStatus(order.getId(), OrderStatus.DELIVERED);
}, 8000);
