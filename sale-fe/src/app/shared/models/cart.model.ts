import { ICartItem } from './cartItem.model';
export interface ICart{
  id: String;
  customerId: number;
  shippingFee: number;
  totalPrice: number;
  items: ICartItem[];
}
