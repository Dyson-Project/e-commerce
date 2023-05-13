export interface IAddressJson1{
  level1_id: string;
  name: string;
  type: string;
  level2s: IAddressJson2[];
}

export interface IAddressJson2 {
  level2_id: string;
  name: string;
  type: string;
  level3s: IAddressJson3[];
}

export interface IAddressJson3{
  level3_id: string;
  name: string;
  type: string;
}