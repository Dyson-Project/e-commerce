import {ISku} from "./sku.model";
import {IBrand} from './brand.model';
import {ICategory} from './category.model';

export interface IProduct {
  id: number;
  categoryId: number;
  brandId: number;
  sellerId: number;
  productName: string;
  description: string;
  status: string;
  skus: ISku[];
  brand: IBrand,
  category: ICategory
}
