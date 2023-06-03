import { IAddress } from './address.model';
export interface IRegistingRequest{
  name: string;
  phoneNumber:string;
  email: string;
  password: string;
  confirmPassword: string;
}