import { ISku } from "./sku.model";

export interface IProduct{
  id: number;
  categoryId: number;
  brandId: number;
  sellerId: number;
  productName: string;
  description: string;
  status: string;
  skus: ISku[];
}