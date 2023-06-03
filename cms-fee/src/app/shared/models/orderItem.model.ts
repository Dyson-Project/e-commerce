import { IImage } from './image.model';
import { ISku } from './sku.model';
export interface IOrderItem{
  id: number;
  orderId: number;
  skuId: number;
  name: string;
  variation: string;
  price: number;
  quantity: number;
  image: string;
  sku: ISku
}