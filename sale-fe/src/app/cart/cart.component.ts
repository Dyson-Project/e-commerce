import {combineLatest, Observable} from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {CartWrapperService} from '../shared/services/cart.wrapper.service';
import {CartService} from './cart.service';
import {ICart} from '../shared/models/cart.model';
import {ConfigurationService} from '../shared/services/configuration.service';
import {ICartItem} from '../shared/models/cartItem.model';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalComponent} from '../shared/components/modal/modal.component';
import {SecurityService} from '../shared/services/security.service';
import {EPaymentMethod} from '../shared/models/paymentMethod.const';
import {IAddress} from '../../../../cms-fee/src/app/shared/models/address.model';
import {IOrder} from '../shared/models/order.model';
import {DateFormat} from '../shared/util/date.format';
import {EOrderStatus} from '../shared/models/orderStatus.const';
import {IOrderItem} from '../shared/models/orderItem.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  errorMessages: any;
  cart!: ICart;
  cartItems: ICartItem[] = [];
  provisional: number = 0;
  shippingFee: number = 0;
  totalPrice: number = 0;
  shippingAddress?: IAddress;
  addressJsonString: string = '';
  addressList: IAddress[] = [];
  paymentList: any[] = [
    {name: 'Cash on delivery', icon: 'fas fa-money-bill-alt', value: EPaymentMethod.COD},
    {name: 'Visa', icon: 'fab fa-cc-visa', value: EPaymentMethod.VISA},
    {name: 'Credit card', icon: 'fas fa-credit-card', value: EPaymentMethod.CREDIT},
    {name: 'Bitcoin', icon: 'fab fa-bitcoin', value: EPaymentMethod.BITCOIN},
    {name: 'Paypal', icon: 'fab fa-cc-paypal', value: EPaymentMethod.PAYPAL},
    {name: 'Mastercard', icon: 'fab fa-cc-mastercard', value: EPaymentMethod.MASTERCARD}
  ];
  selectedPayment = this.paymentList[0];
  closeResult = '';

  constructor(
    private service: CartService,
    private router: Router,
    private configurationService: ConfigurationService,
    private cartWrapper: CartWrapperService,
    private modalService: NgbModal,
    private securityService: SecurityService
  ) {
  }

  ngOnInit(): void {
    if (!this.securityService.IsAuthorized) {
      this.securityService.GoToLoginPage();
    }

    if (this.configurationService.isReady) {
      this.loadData();
    } else {
      this.configurationService.settingLoaded$.subscribe(x => {
        this.loadData();
      });
    }
  }

  loadData() {
    // Guard address
    this.securityService.getUser(this.securityService.UserData.id).subscribe({
      next: res => {
        if (res.address.length == 0) {
          this.router.navigate(['/account/address'])
          alert('You need to have a address');
        }
      }
    })

    let promiseAddress = () => Promise.all([
      this.getAddress(),
      this.service.getAddress().toPromise()
    ]);
    promiseAddress().then(() => this.getCart());

  }

  getCart(): any {
    this.service.getCart().subscribe(cart => {
      this.cart = cart;
      this.calculateTotalPrice();
    });
  }

  getAddress() {
    this.service.getAddress().subscribe({
      next: addressList => {
        this.addressList = addressList;
        if (this.addressList.length > 0)
          this.shippingAddress = this.addressList[0]
        this.addressJsonString = JSON.stringify(this.shippingAddress);
      }
    });
  }

  itemQuantityChanged(item: ICartItem): void {
    let maximunQuantity: number;
    if (item.quantity < 1) {
      item.quantity = 1;
    }
    this.service.getSkuFormCartItem(item).subscribe({
      next: sku => {
        maximunQuantity = sku.available;
      },
      complete: () => {
        console.log('quantity' + maximunQuantity);
        if (maximunQuantity < item.quantity) {
          item.quantity = maximunQuantity;
        } else {
          this.calculateTotalPrice();
          this.service.setCart(this.cart).subscribe({
            next: x => console.log('cart updated:', x)
          });
        }
      }
    });
  }

  itemQuantityChangedDown(item: ICartItem) {
    item.quantity = item.quantity - 1;
    this.itemQuantityChanged(item);
  }

  itemQuantityChangedUp(item: ICartItem) {
    item.quantity = Number(item.quantity) + 1;
    this.itemQuantityChanged(item);
  }

  selectCartItem(itemRemoves: ICartItem[]) {
    itemRemoves.forEach(item => {
      if (this.cartItems.indexOf(item) == -1) {
        this.cartItems.push(item);
      } else {
        this.cartItems.splice(this.cartItems.indexOf(item), 1);
      }
    });
    console.log(this.cartItems);
  }

  removeCartItem(itemRemoves: ICartItem[]) {
    let observables: any[] = [];
    itemRemoves.forEach(itemRemove => {
      const observable = this.service.removeCartItem(itemRemove);
      observables.push(observable);
    });
    combineLatest(observables)
      .subscribe({
        next: res => {
          this.cartItems = [];
          this.getCart();
          this.cartWrapper.updateBadge();
          this.loadData();
        }
      });
  }

  update(): Observable<boolean> {
    const setCartObservable = this.service.setCart(this.cart);
    setCartObservable
      .subscribe(
        x => {
          this.errorMessages = [];
          console.log('cart updated:', x);
        },
        errorMessage => this.errorMessages = errorMessage.messages);
    return setCartObservable;
  }

  checkOut() {
    const addressObj: IAddress = JSON.parse(this.addressJsonString);
    const address = `${addressObj.street}, ${addressObj.address1}, ${addressObj.address2}, ${addressObj.address3}`;
    const order: IOrder = this.mapCartInfoCheckout(this.cart, this.selectedPayment.value, address);
    this.service.createOrder(order)
      .subscribe({
        next: insertedOrder => {
          order.orderItems.forEach(item => {
            item.orderId = insertedOrder.id;
          })
          this.service.createOrderItems(order.orderItems).subscribe({
            next: res => {
              this.service.setCartEmpty().subscribe({
                next: (res) => {
                  this.cart = res;
                  if (order.paymentMethod == EPaymentMethod.COD) {
                    this.router.navigateByUrl('/paymentsuccess/' + insertedOrder.id);
                  } else {
                    this.router.navigateByUrl('/checkout/' + insertedOrder.id);
                  }
                }
              });
            }
          })
        },
        error: err => {
          alert('this product is sold-out');
        }
      });
  }

  mapCartInfoCheckout(cart: ICart, paymentMethod: any, address: any): IOrder {
    return {
      customerId: cart.customerId,
      createDate: DateFormat.formatISO(new Date()),
      updateDate: DateFormat.formatISO(new Date()),
      shippingFee: cart.shippingFee,
      shippingAddress: address,
      totalPrice: cart.totalPrice,
      status: paymentMethod == EPaymentMethod.COD ? EOrderStatus.Pending : EOrderStatus.Unpaid,
      paymentMethod,
      id: 0,
      orderItems: cart.items.map((cartItem) => {
        let orderItem: IOrderItem = {
          id: 0,
          image: cartItem.image,
          price: cartItem.itemPrice,
          name: cartItem.name,
          orderId: -1,
          quantity: cartItem.quantity,
          skuId: cartItem.skuId,
          variation: cartItem.variation
        };
        return orderItem;
      })
    };
  }

  private calculateTotalPrice() {
    this.totalPrice = 0;
    this.provisional = 0;
    this.shippingFee = 0;
    this.cart.items.forEach(item => {
      this.provisional += (item.itemPrice * item.quantity);
      this.shippingFee += new Date().getDate();
    });
    this.totalPrice = this.provisional + this.shippingFee;
    this.cart.shippingFee = this.shippingFee;
    this.cart.totalPrice = this.totalPrice
  }

  stringify(str: any): string {
    return JSON.stringify(str);
  }

  confirmCheckout(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
      .result
      .then((result) => {
        // this.checkOut();
        return true;
      }, (reason) => (false))
      .then((res) => {
        console.log('confirm order', res);
        return res ? this.confirmPaymentMethod() : false;
      }, (reason) => (false))
      .then((paymentResult) => {
        if (paymentResult) {
          this.selectedPayment = JSON.parse(paymentResult);
          this.checkOut();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  confirmPaymentMethod(): Promise<any> {
    const modelPayment = this.modalService.open(ModalComponent, {ariaLabelledBy: 'modal-basic-title'})
    modelPayment.componentInstance.model = this.paymentList;
    return modelPayment.result;
  }

  changePaymentMethod(): Promise<any> {
    const modelPayment = this.modalService.open(ModalComponent, {ariaLabelledBy: 'modal-basic-title'})
    modelPayment.componentInstance.model = this.paymentList;
    return modelPayment.result;
    // .then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    //   console.log(result);
    //   this.selectedPayment = JSON.parse(result);
    // }, (reason) => {
    // });
  }
}


