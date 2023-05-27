import {SecurityService} from './security.service';
import {ISku} from '../models/sku.model';
import {IOrder} from '../models/order.model';
import {IOrderItem} from '../models/orderItem.model';
import {Guid} from '../../../guid';
import {Injectable} from "@angular/core";
import {Subject} from 'rxjs';
import {ICartItem} from '../models/cartItem.model';
import {ICart} from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartWrapperService {
  public cart: ICart;

  constructor(private identityService: SecurityService) {
  }

  private addItemToCartSource = new Subject<ICartItem>();
  addItemToCart$ = this.addItemToCartSource.asObservable();

  private updateBagedSource = new Subject<ICartItem>();
  updateBage$ = this.updateBagedSource.asObservable();

  private orderCreatedSouce = new Subject();
  orderCreated$ = this.orderCreatedSouce.asObservable();

  addItemToCart(item: ICartItem) {
    if (this.identityService.IsAuthorized) {
      // TODO: Can mapping from sku to cart item here!!!
      this.addItemToCartSource.next(item);
    } else {
      this.identityService.GoToLoginPage();
    }
  }

  updateBadge() {
    this.updateBagedSource.next();
  }

  orderCreate() {
    this.orderCreatedSouce.next();
  }
}
