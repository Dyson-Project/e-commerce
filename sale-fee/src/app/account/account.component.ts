import {ConfigurationService} from '../shared/services/configuration.service';
import {SecurityService} from '../shared/services/security.service';
import {AccountService} from './account.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  constructor(
    private configurationService: ConfigurationService,
    private securityService: SecurityService,
    private service: AccountService,
  ) {

  }

  ngOnInit(): void {
  }

}
