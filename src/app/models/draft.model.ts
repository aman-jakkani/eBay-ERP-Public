interface DraftParameters {
  id: string;
  updated_SKU: boolean;
  published_draft: boolean;
  listed: boolean;
  title: string;
  condition: string;
  condition_desc: string;
  price: number;
}

export class Draft {

  readonly id: string;
  updated_SKU: boolean;
  published_draft: boolean;
  listed: boolean;
  title: string;
  condition: string;
  condition_desc: string;
  price: number;

  constructor({
    id,
    updated_SKU,
    published_draft,
    listed,
    title,
    condition,
    condition_desc,
    price
  }: DraftParameters){
    this.id = id;
    this.updated_SKU = updated_SKU;
    this.published_draft = published_draft;
    this.listed = listed;
    this.title = title;
    this.condition = condition;
    this.condition_desc = condition_desc;
    this.price = price;
  }



}