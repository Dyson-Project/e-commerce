import { OrderListService } from './order-list.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { SecurityService } from '../shared/services/security.service';
import { EOrderStatus } from '../shared/models/orderStatus.const';
import { IOrder } from '../shared/models/order.model';
import { EPaymentMethod } from '../shared/models/paymentMethod.const';
import { ICatalog } from '../shared/models/catalog.model';
import { Observable } from 'rxjs';
import { IPager } from '../shared/models/pager.model';
import { ConfirmModelComponent } from '../shared/components/confirm-model/confirm-model.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { stat } from 'node:fs';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  selectedTab:string = EOrderStatus.All;
  searchFormGroup: FormGroup;
  orders: IOrder[] = [];
  selectedOrders: IOrder[] = [];
  toggledOrders: number[] = [];
  currentQuery = {
    pageIndex: 0,
    pageSize: 4,
    status: null,
  };
  OrderStatus = [
    { name: 'All', value: EOrderStatus.All },
    { name: 'Unpaid', value: EOrderStatus.Unpaid },
    { name: 'Pending', value: EOrderStatus.Pending },
    { name: 'Ready To Ship', value: EOrderStatus.ReadyToShip },
    { name: 'Shipped', value: EOrderStatus.Shipped },
    { name: 'Delivered', value: EOrderStatus.Delivered },
    { name: 'Canceled', value: EOrderStatus.Canceled }
  ];
  EOrderStatus = EOrderStatus;
  EPaymentMethod = EPaymentMethod;
  paginationInfo:IPager;
  constructor(
    private service: OrderListService,
    private configurationService: ConfigurationService,
    private securityService: SecurityService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    if(this.configurationService.isReady){
      this.loadData();
    } else {
      this.configurationService.settingLoaded$.subscribe(x=>{
        this.loadData();
      })
    }
  }

  changeTab(orderStatus: string){
    this.selectedTab = orderStatus;
    this.selectedOrders=[];
    this.currentQuery = { ...this.currentQuery, pageIndex: 0, status: orderStatus };
    this.getOrdersCatalog(this.currentQuery);
  }

  loadData(){
    this.getOrdersCatalog(this.currentQuery);
    this.loadSearchForm();
  }

  getOrdersCatalog(query?:{[param:string]: any} ){
    this.service.getOrdersCatalog(query).subscribe({
      next: catalog => {
        this.orders = catalog.data;
        console.log(this.orders);
        this.paginationInfo = {
          actualPage : catalog.pageIndex,
          itemsPage : catalog.pageSize,
          totalItems: catalog.count,
          items: catalog.data.length,
          totalPages: Math.ceil(catalog.count / catalog.pageSize)
        }
      }
    })
  }

  loadSearchForm(){
    this.searchFormGroup = new SearchFormGroup({
      id: new FormControl(null),
      createDate: new FormControl(null),
      paymentMethod: new FormControl(null)
    });
  }

  searchOrder() {
    console.log(this.searchFormGroup);
    this.currentQuery = {...this.currentQuery, ...this.searchFormGroup.value};
    console.log(this.currentQuery);
    this.getOrdersCatalog(this.currentQuery);
  }

  onCheckOrder($event, orderId?: number) {
    console.log(orderId);
    if ($event.target.checked) {
      if (orderId) {
        this.selectedOrders.push({ ...this.orders.find(order => (order.id == orderId)) });
      } else {
        this.selectedOrders = [];
        this.selectedOrders.push(...this.orders);
      }
    } else {
      if (!orderId) {
        this.selectedOrders = [];
      } else {
        this.selectedOrders.splice(this.selectedOrders.findIndex(order => order.id == orderId), 1);
      }
    }
    console.log(this.selectedOrders);
  }

  isSelected(orderId: number) {
    return this.selectedOrders.some(order => order.id == orderId)
  }

  toggleOrderItem(orderId:number){
    if (!this.toggledOrders.some(id => id == orderId)) {
      this.toggledOrders.push(orderId);
    } else {
      this.toggledOrders.splice(this.toggledOrders.indexOf(orderId), 1);
    }
    console.log(this.toggledOrders);
  }

  isToggled(orderId:number){
    return this.toggledOrders.some(id=>id==orderId);
  }

  changeStatusOrders(selectedOrders: IOrder[], status: string) {
    let confirmRef = this.modalService.open(ConfirmModelComponent);
    console.log("change status");
    confirmRef.componentInstance.message = `Change status to ${status}`
    confirmRef.result.then((result) => {
      selectedOrders.forEach(order => {
        order.status = status;
        console.log(order);
        this.service.updateOrder(order).subscribe(x => {
          console.log(x);
        })
      });
    }, (reason)=>{})
  }

  print(orders: IOrder[]){
    this.service.createPDF(orders);
  }
  
  onPageChanged($event){
    this.currentQuery.pageIndex = $event;
    this.getOrdersCatalog(this.currentQuery)
  }

  get Object(){
    return Object;
  }
}

class SearchFormGroup extends FormGroup{
  constructor(
    controls: { [key: string]: AbstractControl },
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
    ) {
      super(controls, validatorOrOpts, asyncValidator)
    }

    get idControl(): FormControl{
      return this.get('id') as FormControl;
    }

    get createDateControl(): FormControl{
      return this.get('createDate') as FormControl;
    }

    get paymentMethodControl(): FormControl{
      return this.get('paymentMethod') as FormControl;
    }

    // get statusControl(): FormControl{
    //   return this.get('status') as FormControl;
    // }
}
