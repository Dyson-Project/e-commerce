import {Component, OnInit, ViewChild} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {KeycloakProfile} from 'keycloak-js';
import {JsonEditorComponent, JsonEditorOptions} from "ang-jsoneditor";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoggedIn = false;
  public userProfile: KeycloakProfile;
  public editorOptions: JsonEditorOptions
  public data: any;
  @ViewChild(JsonEditorComponent, {static: false}) editor: JsonEditorComponent;

  constructor(private readonly keycloak: KeycloakService) {
    this.editorOptions = new JsonEditorOptions();
    this.data = {
      "products": [{
        "name": "car",
        "product": [{
          "name": "honda",
          "model": [{"id": "civic", "name": "civic"}, {"id": "accord", "name": "accord"}, {
            "id": "crv",
            "name": "crv"
          }, {"id": "pilot", "name": "pilot"}, {"id": "odyssey", "name": "odyssey"}]
        }]
      }]
    }
  }

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();
    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
    }
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout();
  }
}
