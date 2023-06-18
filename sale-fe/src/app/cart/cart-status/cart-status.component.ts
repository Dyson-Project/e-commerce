import {Subscription} from 'rxjs';
import {CartService} from '../cart.service';
import {CartWrapperService} from '../../shared/services/cart.wrapper.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.scss']
})
export class CartStatusComponent implements OnInit {
  updateCartSubscription!: Subscription;
  badge: number = 0;

  constructor(
    private service: CartService,
    private cartWrapperService: CartWrapperService,
  ) {
  }

  ngOnInit() {
    // Subcibe to Add Basket Observable:
    console.log('init cart status');
    this.updateCartSubscription = this.cartWrapperService.updateBadge$.subscribe(
      (badge: number) => {
        console.log('removed item from cart');
        this.badge = badge
      }
    );

  }

}

