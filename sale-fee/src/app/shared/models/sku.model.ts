import {IImage} from './image.model';

export interface ISku {
  id: number;
  productId: number;
  sellerSku: string;
  available: number;
  quantity: number;
  color: string;
  size: number;
  height: number;
  width: number;
  length: number;
  weight: number;
  price: number;
  images: IImage[];
}
