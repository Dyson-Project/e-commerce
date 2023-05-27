import {IImage} from './image.model';

export interface IOrderItem {
  id: number;
  orderId: number;
  skuId: number;
  name: string;
  variation: string;
  price: number;
  quantity: number;
  image: string;
}
