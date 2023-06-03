import { ISellerAccount } from '../../models/seller.model';
import { SecurityService } from '../../services/security.service';
import { ConfigurationService } from '../../services/configuration.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userName:string;
  constructor(
    private securityService: SecurityService,
    private configurationService:ConfigurationService
    ) {

  }

  ngOnInit() {
      if(this.configurationService.isReady){
        this.userName = this.securityService.UserData.name;
      } else {
        this.configurationService.settingLoaded$.subscribe(x=>{
        this.userName = this.securityService.UserData.name;
        })
      }
  }

  logOut(){
    this.securityService.Logoff();
  }
}
