import { Address } from "./src/address/address";
import { FlatDiscount } from "./src/discount/discount";
import { OrderStatus } from "./src/enum";
import { CartItem } from "./src/order/order";
import { UPI } from "./src/payment/payment";
import { Menu } from "./src/restro/menu/menu";
import { MenuItem } from "./src/restro/menuItem/menuItem";
import { SwiggyService } from "./src/swiggyService";

const swiggy = SwiggyService.getInstance();

const harshit = swiggy.createCustomers("harshit", "9977");

const agent1 = swiggy.createDeliveryAgents("agent1", "7788");
const agent2 = swiggy.createDeliveryAgents("agent1", "7788");

const pista_house = swiggy.createRestro(
  "Pista_House",
  new Address("Hietch", "HYD"),
);

const dosa = new MenuItem(crypto.randomUUID(), "DOSA", 80);
const chickenBiryani = new MenuItem(crypto.randomUUID(), "C:Biryani", 300);
const vegBiryani = new MenuItem(crypto.randomUUID(), "V:Biryani", 200);

const pistaHouse_menu_card = new Menu();
pistaHouse_menu_card.addMenuItem(dosa);
pistaHouse_menu_card.addMenuItem(chickenBiryani);
pistaHouse_menu_card.addMenuItem(vegBiryani);

pista_house.setMenu(pistaHouse_menu_card);

harshit.addToCart(new CartItem(chickenBiryani, 2));
harshit.addToCart(new CartItem(dosa, 3));

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
