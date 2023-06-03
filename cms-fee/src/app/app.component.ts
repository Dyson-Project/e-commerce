import { SecurityService } from './shared/services/security.service';
import { ConfigurationService } from './shared/services/configuration.service';
import { Subscription } from 'rxjs';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

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
    private configurationService: ConfigurationService
  ) {
    this.Authenticated = this.securityService.IsAuthorized;
  }

  ngOnInit(): void {
    console.log('app init');
    this.subscription = this.securityService.authenticationChallenge$.subscribe(res=> this.Authenticated=res);
    
    this.configurationService.load();
    this.setTitle('Eshop Seller');
  }

  public setTitle(newTitle: string){
    this.titleService.setTitle(newTitle);
  }

}
