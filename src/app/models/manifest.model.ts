interface ManifestParameters {
  id: string,
  auction_title: string,
  auction_id: number,
  transaction_id: number,
  quantity: number,
  total_price: number,
  date_purchased: Date,
  status: string
}

export class Manifest  {
   readonly id: string;
   readonly auction_title: string;
   readonly auction_id: number;
   readonly transaction_id: number;
   readonly quantity: number;
   readonly total_price: number;
   readonly date_purchased: Date;
   readonly status: string;
  
  constructor({
    id,
    auction_title,
    auction_id,
    transaction_id,
    quantity,
    total_price,
    date_purchased,
    status
  }:ManifestParameters){
      this.id = id;     
      this.auction_title = auction_title;
      this.auction_id = auction_id;
      this.transaction_id = transaction_id;
      this.quantity = quantity;
      this.total_price = total_price;
      this.date_purchased = date_purchased;
      this.status = status;
  }


}
