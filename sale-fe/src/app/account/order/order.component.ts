import {ConfigurationService} from '../../shared/services/configuration.service';
import {SecurityService} from '../../shared/services/security.service';
import {AccountService} from '../account.service';
import {Subscription} from 'rxjs';
import {IOrder} from '../../shared/models/order.model';
import {EOrderStatus} from '../../shared/models/orderStatus.const';
import {IPager} from '../../shared/models/pager.model';
import {EPaymentMethod} from '../../shared/models/paymentMethod.const';
import {ConfirmModalComponent} from '../../shared/components/confirm-modal/confirm-modal.component';
import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidatorFn
} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  authSubscription?: Subscription;
  authenticated: boolean = false;
  selectedTab: string = EOrderStatus.All;
  orders: IOrder[] = [];
  currentQuery = {
    page: 0,
    size: 4,
    status: EOrderStatus.All,
  };
  OrderStatus = [
    {name: 'All', value: EOrderStatus.All},
    {name: 'Unpaid', value: EOrderStatus.Unpaid},
    {name: 'Pending', value: EOrderStatus.Pending},
    {name: 'Ready To Ship', value: EOrderStatus.ReadyToShip},
    {name: 'Shipped', value: EOrderStatus.Shipped},
    {name: 'Delivered', value: EOrderStatus.Delivered},
    {name: 'Canceled', value: EOrderStatus.Canceled}
  ];
  EOrderStatus = EOrderStatus;
  EPaymentMethod = EPaymentMethod;
  paginationInfo: IPager = {actualPage: 0, totalItems: 0, items: 0, totalPages: 0};
  searchFormGroup?: FormGroup;

  constructor(
    private configurationService: ConfigurationService,
    private securityService: SecurityService,
    private service: AccountService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
      this.loadData();


    this.authSubscription = this.securityService.authenticationChallenge$.subscribe({
      next: res => {
        this.authenticated = res;
      }
    })
  }

  changeTab(orderStatus: string) {
    this.selectedTab = orderStatus;
    this.currentQuery = {...this.currentQuery, page: 0, status: orderStatus};
    this.loadOrdersCatalog(this.currentQuery);
  }

  loadData() {
    console.log('load daata');
    this.loadOrdersCatalog(this.currentQuery);
    this.loadSearchForm();
  }

  loadOrdersCatalog(params: { [param: string]: any }) {
    this.service.getOrderCatalog(params).subscribe({
      next: catalog => {
        this.orders = catalog.data;
        console.log(this.orders);
        this.paginationInfo = {
          actualPage: catalog.number,
          totalItems: catalog.totalElements,
          items: catalog.data.length,
          totalPages: catalog.totalPages
        }
      }
    })
  }

  searchOrder() {
    console.log(this.searchFormGroup);
    if (this.searchFormGroup) {
      this.currentQuery = {...this.currentQuery, ...this.searchFormGroup.value};
    }
    console.log(this.currentQuery);
    this.loadOrdersCatalog(this.currentQuery)
  }

  cancelOrder(orderId: number) {
    let ref = this.modalService.open(ConfirmModalComponent);
    ref.componentInstance.message = 'Cancel your order?';
    ref.result.then((result) => {
      let order = this.orders.find(order => order.id === orderId);
      if (order) {
        order.status = EOrderStatus.Canceled;
        console.log(order);
        this.service.updateOrder(order).subscribe({
          next: res => {
          },
          complete: () => {
            this.loadData();
          }
        })
      }
    }, (reason) => {
    });
  }

  openConfirmModal(content: any, orderId: any) {
    this.modalService.open(content, {ariaLabelledBy: 'change-pwd'}).result.then((result) => {
      this.cancelOrder(orderId);
    }, (reason) => {
    });
  }

  loadSearchForm() {
    this.searchFormGroup = new SearchFormGroup({
      id: new FormControl(null),
      createDate: new FormControl(null),
      paymentMethod: new FormControl(null)
    });
  }

  onPageChanged($event: any) {
    this.currentQuery.page = $event;
    this.loadOrdersCatalog(this.currentQuery)
  }

  get Object() {
    return Object;
  }
}

class SearchFormGroup extends FormGroup {
  constructor(
    controls: { [key: string]: AbstractControl },
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super(controls, validatorOrOpts, asyncValidator)
  }

  get idControl(): FormControl {
    return this.get('id') as FormControl;
  }

  get createDateControl(): FormControl {
    return this.get('createDate') as FormControl;
  }

  get paymentMethodControl(): FormControl {
    return this.get('paymentMethod') as FormControl;
  }

  // get statusControl(): FormControl{
  //   return this.get('status') as FormControl;
  // }
}
