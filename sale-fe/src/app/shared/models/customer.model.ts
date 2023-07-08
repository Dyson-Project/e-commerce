import { IAddress } from './address.model';
export interface ICustomer{
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: IAddress[]
}
