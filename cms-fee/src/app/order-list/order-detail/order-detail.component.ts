import { ConfigurationService } from '../../shared/services/configuration.service';
import { EOrderStatus } from '../../shared/models/orderStatus.const';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrder } from 'src/app/shared/models/order.model';
import { OrderListService } from '../order-list.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order: IOrder;

  private numberCompleted = false;
  private expiryCompleted = false;
  private cvcCompleted = false;
  processing = false;
  EORderStatus = EOrderStatus;
  constructor(
    private route: ActivatedRoute,
    private configurationService: ConfigurationService,
    private router: Router,
    private service: OrderListService
    ) { }

  ngOnInit() {
    if (this.configurationService.isReady) {
    this.getOrder();
    } else {
      this.configurationService.settingLoaded$.subscribe(x => {
    this.getOrder();
      });
    }
  }

  get cardInfoInvalid(){
    return !(this.numberCompleted && this.expiryCompleted && this.cvcCompleted);
  }

  private getOrder() {
    const orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    this.service.getOrder(orderId)
      .subscribe({
        next: order => this.order = order,
        error: err => console.log(err)
      });
  }

}