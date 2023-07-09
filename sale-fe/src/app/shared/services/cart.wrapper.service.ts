import {Injectable} from "@angular/core";
import {Subject} from 'rxjs';
import {ICartItem} from '../models/cartItem.model';
import {ICart} from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartWrapperService {

  constructor() {
  }

  private addItemToCartSource = new Subject<ICartItem>();
  addItemToCart$ = this.addItemToCartSource.asObservable();

  private updateBadgeSource = new Subject<number>();
  updateBadge$ = this.updateBadgeSource.asObservable();

  private orderCreatedSource = new Subject();
  orderCreated$ = this.orderCreatedSource.asObservable();

  addItemToCart(item: ICartItem) {
    this.addItemToCartSource.next(item);
    this.updateBadge(item.quantity);
  }

  updateBadge(itemCount: number) {
    this.updateBadgeSource.next(itemCount);
  }

  orderCreate() {
    this.orderCreatedSource.next(null);
  }
}
