import {Component, OnInit} from '@angular/core';
import {SecurityService} from '../../services/security.service';
import {ICustomer} from '../../models/customer.model';

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss']
})
export class Identity implements OnInit {
  authenticated: boolean = false;
  customer?: ICustomer;

  constructor(
    private service: SecurityService,
  ) {
  }

  ngOnInit(): void {
    this.service.getUserProfile().subscribe(value => {
      console.log(value)
      this.authenticated = true;
      this.customer = value;
    });
  }


  login(): void {
    this.service.login().then(value => {
    })
  }

  logout(): void {
    this.service.logout(location.origin).then(r => {
    })
  }
}
