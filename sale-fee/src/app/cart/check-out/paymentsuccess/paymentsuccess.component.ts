import {SecurityService} from '../../../shared/services/security.service';
import {ConfigurationService} from '../../../shared/services/configuration.service';
import {ActivatedRoute} from '@angular/router';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-paymentsuccess',
  templateUrl: './paymentsuccess.component.html',
  styleUrls: ['./paymentsuccess.component.scss']
})
export class PaymentsuccessComponent implements OnInit {
  orderId;

  constructor(
    private securityService: SecurityService,
    private configurationService: ConfigurationService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
  }

}
