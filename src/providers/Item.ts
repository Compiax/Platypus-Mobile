export class Item {

  private id: number;
  private price: number;
  private quantity: number;
  private name: string;

  constructor(id, p, q, n) {
    this.id = id;
    this.price = p;
    this.quantity = q;
    this.name = n;
  }

  public setPrice(p) {
    this.price = p;
  }

  public setQuantity(q) {
    this.quantity = q;
  }

  public setName(n) {
    this.name = n;
  }

  public getPrice() {
    return this.price;
  }

  public getQuantity() {
    return this.quantity;
  }

  public getName() {
    return this.name;
  }

  public decrementQuantity() {
    this.quantity--;
  }

  public incrementQuantity() {
    this.quantity++;
  }
}
