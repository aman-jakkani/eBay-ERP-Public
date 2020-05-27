interface ItemParameters {
  id: string;
  name: string;
  quantity: number;
  price: number;
  model: string;
  grade: string;
  product_id: string;
  manifest_id: string;
}

export class Item {
  readonly id: string;
  readonly name: string;
  readonly quantity: number;
  readonly price: number;
  readonly model: string;
  readonly grade: string;
  readonly product_id: string;
  readonly manifest_id: string;

  constructor({
    id,
    name,
    quantity,
    price,
    model,
    grade,
    product_id,
    manifest_id
  }: ItemParameters){
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.price = price;
    this.model = model;
    this.grade = grade;
    this.product_id = product_id;
    this.manifest_id = manifest_id;
  }
}