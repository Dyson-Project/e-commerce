import {SecurityService} from './security.service';
import {Injectable} from "@angular/core";
import {Subject} from 'rxjs';
import {ICartItem} from '../models/cartItem.model';
import {ICart} from '../models/cart.model';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  constructor(protected http:HttpClient) {
  }
}
