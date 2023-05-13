import { IOrderItem } from "./orderItem.model";

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
}