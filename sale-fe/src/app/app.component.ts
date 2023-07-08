import {Component, ViewContainerRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {SecurityService} from './shared/services/security.service';
import {ConfigurationService} from './shared/services/configuration.service';
import {ToastrService} from 'ngx-toastr';
import {Title} from '@angular/platform-browser';
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private titleService: Title,
    private securityService: SecurityService,
    private configurationService: ConfigurationService,
  ) {
  }

  ngOnInit(): void {
    console.log("------------> ",environment.API_HOST, environment.production)
    if (environment.production) {
      console.log('Production!');
    } else {
      console.log('Development!');
    }
    this.configurationService.load();
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle('EShop');
  }
}
