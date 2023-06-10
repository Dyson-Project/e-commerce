import {Component, OnInit, ViewChild} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {KeycloakProfile} from 'keycloak-js';
import {JsonEditorComponent, JsonEditorOptions} from "ang-jsoneditor";
import {UntypedFormBuilder} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {shareReplay} from "rxjs";
import {FormController} from "./categories";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;
  public editorOptions: JsonEditorOptions;
  public apiPath: string = "/api"
  @ViewChild(JsonEditorComponent, {static: false}) editor: JsonEditorComponent;
  public form: FormController
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private readonly keycloak: KeycloakService, public formBuilder: UntypedFormBuilder, protected http: HttpClient) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
    this.editorOptions.expandAll = true
    this.editorOptions.indentation = 2
    this.http = http;
    this.form = new FormController(formBuilder);
    this.editor = new JsonEditorComponent();
  }

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();
    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
    }
    this.http.get(this.apiPath)
      .subscribe(value => {
        this.form.updateValue(value)
      })

  }

  public login() {
    this.keycloak.login().then(value => {
    });
  }

  public logout() {
    this.keycloak.logout().then(value => {
    });
  }

  onKey(event: any) {
    this.apiPath = event.target.value;
  }

  post() {
    this.http.post(this.apiPath, this.form.getValueStr(), this.httpOptions)
      .subscribe(value => {
        this.form.updateValue({input: value})
      })
  }

  put() {
    this.http.put(this.apiPath, this.form.getValueStr(), this.httpOptions)
      .subscribe(value => {
        this.form.updateValue({input: value})
      })
  }

  delete() {
    this.http.delete(this.apiPath)
      .subscribe(value => {
        this.form.updateValue({input: value})
      })
  }

  load() {
    this.http.get<any>(this.apiPath)
      .pipe(shareReplay(1))
      .subscribe(value => {
        this.form.updateValue({input: value});
      })
  }
}
