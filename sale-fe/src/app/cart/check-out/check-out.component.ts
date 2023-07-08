import {IOrder} from '../../shared/models/order.model';
import {CartService} from '../cart.service';
import {environment} from '../../../environments/environment';
import {EOrderStatus} from '../../shared/models/orderStatus.const';
import {ConfigurationService} from '../../shared/services/configuration.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgModel} from '@angular/forms';
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

declare var Stripe: any;

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit, AfterViewInit {
  @ViewChild('cardName') cardName!: NgModel;
  @ViewChild('cardNumber') cardNumberElement!: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement!: ElementRef;
  @ViewChild('cardCvc') cardCvcElement!: ElementRef;

  order!: IOrder;
  cardError: any;

  private stripe: any;
  private cardNumber: any;
  private cardHandler = this.onChange.bind(this);

  private numberCompleted = false;
  private expiryCompleted = false;
  private cvcCompleted = false;
  processing = false;
  EORderStatus = EOrderStatus;

  constructor(
    private route: ActivatedRoute,
    private configurationService: ConfigurationService,
    private router: Router,
    private service: CartService) {
  }

  ngOnInit() {
      this.getOrder();

  }

  ngAfterViewInit(): void {
    this.stripe = Stripe(environment.publishableKey);

    const elements = this.stripe.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    const cardExpiry = elements.create('cardExpiry');
    cardExpiry.mount(this.cardExpiryElement.nativeElement);
    cardExpiry.addEventListener('change', this.cardHandler);

    const cardCvc = elements.create('cardCvc');
    cardCvc.mount(this.cardCvcElement.nativeElement);
    cardCvc.addEventListener('change', this.cardHandler);
  }

  get cardInfoInvalid() {
    return !(this.numberCompleted && this.expiryCompleted && this.cvcCompleted);
  }

  private getOrder() {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getOrder(orderId)
      .subscribe({
        next: order => this.order = order,
        error: err => console.log(err)
      });
  }

  onChange(event: any) {
    this.cardError = event.error?.message;

    switch (event.elementType) {
      case 'cardNumber':
        this.numberCompleted = event.complete;
        break;
      case 'cardExpiry':
        this.expiryCompleted = event.complete;
        break;
      case 'cardCvc':
        this.cvcCompleted = event.complete;
        break;
    }
  }

  async onSubmit() {
    try {
      this.processing = true;
      const paymentIntent = await this.createPaymentIntent();
      const paymentResult = await this.confirmPaymentWithStripe(paymentIntent);
      if (paymentResult.paymentIntent) {
        console.log('payment succeeded');
        this.router.navigateByUrl('/paymentsuccess/' + this.order.id);
      } else {
        console.log('payment failed');
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async createPaymentIntent() {
    const paymentInput = {
      orderId: this.order.id
    };
    return this.service.payment(paymentInput).toPromise();
  }

  private async confirmPaymentWithStripe(paymentIntent: any) {
    return this.stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.cardName.value
        }
      }
    })
  }
}
