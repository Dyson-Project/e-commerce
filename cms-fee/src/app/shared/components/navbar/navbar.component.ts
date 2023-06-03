import { routes } from '../../../app.routes';
import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';
import { SecurityService } from '../../services/security.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  routes
  constructor(
    private configurationService: ConfigurationService,
    private securityService: SecurityService
  ) {
    this.routes = routes;
  }

  ngOnInit(): void {
    if (this.configurationService.isReady) {
      console.log(this.routes);
    } else {
      this.configurationService.settingLoaded$.subscribe(x => {
        console.log(this.routes);
      })
    }
  }

  loadData(){

  }
}
