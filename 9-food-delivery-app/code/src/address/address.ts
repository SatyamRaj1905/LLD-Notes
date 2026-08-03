export class Address {
  constructor(
    private street: string,
    private city: string,
    // Below are just for the advanced features like finding restro near you (same applications happen though Uber Architecture)
    private lat: string = null,
    private long: string = null,
  ) {}

  getAddress(): string {
    return `${this.street}, ${this.city}`;
  }
}

// uber architecture (HEXAGONAL)
