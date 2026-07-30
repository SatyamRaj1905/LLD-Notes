import { MenuItem } from "../menuItem/menuItem";

export class Menu { // ! Each Menu will have SINGLE Menu only and it will have MenuItem
  constructor(private items: Map<string, MenuItem> = new Map()) {} // . Just for LISTINGn the Items present in the restro, string or key is Items ID and Value will be obviously MenuItem 

  addMenuItem(item: MenuItem) {
    this.items.set(item.getId(), item);
  }

  remmoveItem(itemId: string) {
    this.items.delete(itemId);
  }

  getMenuItem(itemId: string) {
    return this.items.get(itemId);
  }

  getAllMenuItems(): MenuItem[] {
    return Array.from(this.items.values());
  }
}
