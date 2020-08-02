interface ProductParameters {
    id: string;
    sku: string;
    quantity_sold: number;
    prices_sold: number[];
    item_ids: number[];
}


export class Product {
  readonly id: string;
  sku: string;
  readonly quantity_sold: number;
  readonly prices_sold: number[];
  readonly item_ids: number[];

  constructor({
    id,
    sku,
    quantity_sold,
    prices_sold,
    item_ids,
  }: ProductParameters){
    this.id = id;
    this.sku = sku;
    this.quantity_sold = quantity_sold;
    this.prices_sold = prices_sold;
    this.item_ids = item_ids;
  }



}