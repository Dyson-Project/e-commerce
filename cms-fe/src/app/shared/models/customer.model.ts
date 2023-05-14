import { IAddress } from "./address.model";

export interface ICustomer{
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  password: string;
  accessToken: string;
  accessExpries: string;
  refreshToken: string;
  refreshExpries: string;
  address: IAddress[]
}

