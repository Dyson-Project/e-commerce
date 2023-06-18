import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../../services/security.service';
import { ICustomer } from '../../models/customer.model';
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss']
})
export class Identity implements OnInit {
  authenticated: boolean = false;
  subscription!: Subscription;
  customer?: ICustomer;

  constructor(
    private service: SecurityService,
    private readonly keycloak: KeycloakService,
  ) { }

  ngOnInit(): void {
    this.subscription = this.service.authenticationChallenge$.subscribe(res => {
      this.authenticated = res;
      this.customer = this.service.UserData;
    });

    this.authenticated = this.service.IsAuthorized;

    if (this.authenticated) {
      if (this.service.UserData) {
        this.customer = this.service.UserData;
      }
    }
  }

  login(): void{
    this.keycloak.login().then(value => {
    });
  }

  logout(): void{
    this.service.Logoff();
  }
}
