import { ICartItem } from './cartItem.model';
export interface ICart{
  id: number;
  customerId: number;
  shippingFee: number;
  totalPrice: number;
  items: ICartItem[];
}