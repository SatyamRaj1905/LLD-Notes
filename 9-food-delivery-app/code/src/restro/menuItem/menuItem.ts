export class MenuItem { // ! Real Food Items 
  constructor(
    private id: string,
    private name: string,
    private price: number,
    private available: boolean = true,
    private description: string = null,
    private category: string = null, // Chinese, NorthIndian or something elwe
  ) {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getPrice(): number {
    return this.price;
  }

  isAvailable(): boolean {
    return this.available;
  }

  getCategory(): string {
    return this.category;
  }

  toggleAvailability(): void {
    this.available = !this.available;
  }
}
