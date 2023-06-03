import {Component, OnInit, ViewChild} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {KeycloakProfile} from 'keycloak-js';
import {JsonEditorComponent, JsonEditorOptions} from "ang-jsoneditor";
import {FormGroup, UntypedFormBuilder} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;
  public editorOptions: JsonEditorOptions;
  public data: any;
  @ViewChild(JsonEditorComponent, {static: false}) editor: JsonEditorComponent;
  public form: FormGroup | null = null;

  constructor(private readonly keycloak: KeycloakService, public formBuilder: UntypedFormBuilder) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
    this.editorOptions.theme = 1
    this.editorOptions.expandAll = true
    this.editorOptions.indentation = 2

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
    this.editor = new JsonEditorComponent();
  }

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();
    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
    }

    this.form = this.formBuilder.group({
      input: [this.data]
    });

  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout();
  }

  submit() {
    this.data = JSON.stringify(this.form?.value, null, 2);
    console.log(this.form?.value);
  }
}
