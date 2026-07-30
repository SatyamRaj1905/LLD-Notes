export class Address {
  constructor(
    private street: string,
    private city: string,
    private lat: string = null,
    private long: string = null,
  ) {}

  getAddress(): string {
    return `${this.street}, ${this.city}`;
  }
}

// uber (HEXAGONAL)
