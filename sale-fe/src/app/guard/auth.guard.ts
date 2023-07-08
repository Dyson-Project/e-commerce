import {KeycloakAuthGuard} from "keycloak-angular";
import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {SecurityService} from "../shared/services/security.service";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(router: Router, keycloak: SecurityService) {
    super(router, keycloak);
  }

  async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    console.log(this.authenticated)
    if (!this.authenticated) {
      await this.keycloakAngular.login({
        redirectUri: window.location.origin + state.url,
      });
    }
    return this.authenticated;
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

}
