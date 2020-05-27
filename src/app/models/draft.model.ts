interface DraftParameters {
  id: string;
  updated_SKU: boolean;
  published_draft: boolean;
  listed: boolean;
  title: string;
  condition: string;
  condition_desc: string;
  price: number;
  item_id: string;
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
  readonly item_id: string;


  constructor({
    id,
    updated_SKU,
    published_draft,
    listed,
    title,
    condition,
    condition_desc,
    price,
    item_id
  }: DraftParameters){
    this.id = id;
    this.updated_SKU = updated_SKU;
    this.published_draft = published_draft;
    this.listed = listed;
    this.title = title;
    this.condition = condition;
    this.condition_desc = condition_desc;
    this.price = price;
    this.item_id = item_id;
  }



}
