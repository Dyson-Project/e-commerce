import { IAddress } from "./address.model";

export interface ISellerAccount{
  id: number;
  name: string;
  phoneNumber: string;
  email:string;
  password: string;
  secretKey: string;
  accessToken: string;
  accessExpries: string;
  refreshToken: string;
  refreshExpries: string;
  address:IAddress[]
}