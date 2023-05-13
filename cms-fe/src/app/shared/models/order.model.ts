import { IOrderItem } from "./orderItem.model";
import { ICustomer } from './customer.model';

export interface IOrder {
  id: number;
  customerId: number;
  createDate: string;
  updateDate: string;
  paymentMethod: string;
  shippingFee: number;
  shippingAddress: string;
  totalPrice: number;
  status: string;
  orderItems: IOrderItem[];
  customer: ICustomer;
}