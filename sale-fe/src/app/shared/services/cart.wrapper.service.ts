import {SecurityService} from './security.service';
import {Injectable} from "@angular/core";
import {Subject} from 'rxjs';
import {ICartItem} from '../models/cartItem.model';
import {ICart} from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartWrapperService {
  public cart?: ICart;

  constructor(private identityService: SecurityService) {
  }

  private addItemToCartSource = new Subject<ICartItem>();
  addItemToCart$ = this.addItemToCartSource.asObservable();

  private updateBadgeSource = new Subject<ICartItem>();
  updateBadge$ = this.updateBadgeSource.asObservable();

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
    this.updateBadge$.subscribe(value => {
      this.updateBadgeSource.next(value);
    })
  }

  orderCreate() {
    this.orderCreated$.subscribe(value => {
      this.orderCreatedSouce.next(value);
    })
  }
}
