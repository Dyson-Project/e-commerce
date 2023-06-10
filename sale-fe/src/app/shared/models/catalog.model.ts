export interface IPage<T> {
  number: number;
  data: T[];
  size: number;
  totalElements: number;
  totalPages: number
}
