import {Injectable} from "@angular/core";
import {combineLatest, Observable, Subject} from 'rxjs';
import {DataService} from '../shared/services/data.service';
import {SecurityService} from '../shared/services/security.service';
import {CartWrapperService} from '../shared/services/cart.wrapper.service';
import {ConfigurationService} from "../shared/services/configuration.service";
import {StorageService} from '../shared/services/storage.service';
import {map, tap} from "rxjs/operators";
import {ICart} from '../shared/models/cart.model';
import {ICartItem} from '../shared/models/cartItem.model';
import {ISku} from '../shared/models/sku.model';
import {IOrder} from '../shared/models/order.model';
import {Router} from '@angular/router';
import {IAddress} from '../shared/models/address.model';
import {IOrderItem} from '../shared/models/orderItem.model';
import {Guid} from "../../guid";

const CART_ID = "CART_ID";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartUrl: string = '/api/customer/cart/';
  private orderUrl: string = '/api/orders';
  cart: ICart = {
    id: Guid.newGuid(),
    customerId: 0,
    items: [],
    shippingFee: 0,
    totalPrice: 0
  }

  private cartDroppedSource = new Subject();
  cartDropped$ = this.cartDroppedSource.asObservable();

  constructor(
      private service: DataService,
      private securityService: SecurityService,
      private cartEvents: CartWrapperService,
      private router: Router,
      private configurationService: ConfigurationService,
      private storageService: StorageService
  ) {
    this.cartEvents.orderCreated$.subscribe(x => {
      this.dropCart();
    });
  }

  addItemToCart(newItem: ICartItem): Observable<boolean> {
    console.log('add Item to cart');
    let isNewItem = true;
    this.cart.items.forEach(item => {
      if (item.skuId === newItem.skuId) {
        item.quantity = Number(item.quantity) + Number(newItem.quantity);
        console.log("quantity: " + item.quantity);
        isNewItem = false;
        return;
      }
    });
    if (isNewItem) {
      this.cart.items.push(newItem);
    }
    return this.setCart(this.cart);
  }

  removeCartItem(itemRemove: ICartItem): Observable<boolean> {
    this.cart.items.forEach((item, index) => {
      if (item.skuId === itemRemove.skuId) {
        console.log('finded for remove' + index);
        this.cart.items.splice(index, 1);
        console.log(this.cart);
        return;
      }
    })
    return this.setCart(this.cart);
  }

  getSkuFormCartItem(item: ICartItem): Observable<ISku> {
    const url = '/api/skus/' + item.skuId;
    return this.service.get(url).pipe<ISku>(map((res: any) => res.data));
  }

  setCart(cart: ICart): Observable<boolean> {
    console.log('set cart', cart);
    const url = `${this.cartUrl}/${cart.id}`;
    const cartForPut = {...cart, items: JSON.stringify(cart.items)};
    return this.service.put(url, cartForPut).pipe<boolean>(tap((response: any) => response));
  }

  setCartEmpty(): Observable<ICart> {
    const url = this.cartUrl + '/' + this.cart.id;
    let cart: ICart = {
      customerId: this.cart.customerId,
      id: this.cart.id,
      items: [],
      shippingFee: 0,
      totalPrice: 0
    };
    const cartForPut = {...cart, items: JSON.stringify(cart.items)};
    return this.service.put(url, cartForPut).pipe<ICart>(tap((response: any) => {
      this.cartEvents.orderCreate();
      return response;
    }));
  }

  createOrder(order: IOrder): Observable<IOrder> {
    const url = '/api/orders';
    return this.service.post(url, order).pipe<IOrder>(tap((res: any) => {
      console.log(url, order, res);
      return res;
    }));
  }

  createOrderItems(orderItems: IOrderItem[]): Observable<any[]> {
    const url = '/api/orderitems';
    let observables: any[] = [];
    orderItems.forEach(item => {
      let observable = this.service.post(url, item).pipe<any>(tap((res: any) => {
        console.log(url, orderItems, res);
        return res;
      }));
      observables.push(observable);
    })
    return combineLatest(observables);
  }

  newCart(): Observable<ICart> {
    return this.service.post(this.cartUrl, {}).pipe(tap((value: ICart) => {
      this.storageService.store(CART_ID, value.id);
      this.cartEvents.updateBadge(value.items.length);
    }));
  }

  getCart(): Observable<ICart> {
    const url = this.cartUrl + "/" + this.storageService.retrieve(CART_ID);
    console.log('get cart', url);
    return this.service.get(url).pipe(tap(value => {
      this.cartEvents.updateBadge(value.items.length);
    }));
  }

  getAddress(): Observable<IAddress[]> {
    const url = '/address?customerId=' + this.cart.customerId;
    return this.securityService.getUser(this.securityService.UserData.id)
      .pipe<IAddress[]>(map((res: any) => {
        return res.address;
      }))
    // return this.service.get(url).pipe<IAddress[]>(tap(
    //   {
    //     next: (res: any) => {
    //       if (res.status === 204) {
    //         return null;
    //       }
    //       return res;
    //     },
    //     error: err =>{
    //       console.log(err);
    //         alert("You need to create a address!!!");
    //         this.router.navigate(['/address']);
    //     }
    //   }
    // ));
  }

  // mapCartInfoCheckout(cart: ICart, paymentMethod, address): IOrder{
  //   const order: IOrder = {
  //     customerId: cart.customerId,
  //     createDate: DateFormat.formatISO(new Date()),
  //     updateDate: DateFormat.formatISO(new Date()),
  //     shippingFee: cart.shippingFee,
  //     shippingAddress: address,
  //     totalPrice: cart.shippingFee,
  //     status: EOrderStatus.Unpaid,
  //     paymentMethod,
  //     id: 0,
  //     orderItems: cart.items.map((cartItem) => {
  //       let orderItem: IOrderItem = {
  //         id: 0,
  //         image: cartItem.image,
  //         itemPrice: cartItem.itemPrice,
  //         name: cartItem.name,
  //         orderId: null,
  //         quantity: cartItem.quantity,
  //         skuId: cartItem.skuId,
  //         variation: cartItem.variation
  //       };
  //       return orderItem;
  //     })
  //   };

  //   return order;
  // }

  dropCart() {
    this.cart.items = [];
    this.cartDroppedSource.next(null);
  }

  private loadData() {
    this.getCart().subscribe(cart => {
      if (cart != null) {
        this.cart = cart;
      }
    })
  }

  getOrder(orderId: number): Observable<IOrder> {
    const url = this.orderUrl + '/' + orderId;
    return this.service.get(url).pipe<IOrder>(map((res: any) => {
      console.log(url, res);
      return res.data;
    }));
  }

  payment(info: any) {
    const url = '/api/orders/payment';
    return this.service.post(url, info).pipe<any>(tap((res: any) => {
      console.log(url, res);
      return res;
    }));
  }
}
