import {Component, ViewContainerRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {SecurityService} from './shared/services/security.service';
import {Configuration} from 'tslint';
import {ConfigurationService} from './shared/services/configuration.service';
import {ToastrService} from 'ngx-toastr';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  Authenticated: boolean = false;
  subscription!: Subscription;

  constructor(
    private titleService: Title,
    private securityService: SecurityService,
    private configurationService: ConfigurationService,
    private toastr: ToastrService,
    vcr: ViewContainerRef
  ) {
    this.Authenticated = this.securityService.IsAuthorized;
  }

  ngOnInit(): void {
    console.log('app on init');
    this.subscription = this.securityService.authenticationChallenge$.subscribe(res => this.Authenticated = res);
    this.configurationService.load();
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle('EShop');
  }
}
