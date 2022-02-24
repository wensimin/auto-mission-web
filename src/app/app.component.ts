import {Component} from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isAuthed = false
  username = null

  constructor(private oauthService: OAuthService) {
    this.loadAuth()
  }

  private loadAuth() {
    this.isAuthed = this.oauthService.hasValidAccessToken()
    // @ts-ignore
    this.username = this.isAuthed ? this.oauthService.getIdentityClaims().sub : null
  }

  login() {
    this.oauthService.initLoginFlow()
  }

  logout() {
    this.oauthService.revokeTokenAndLogout().then(() => this.isAuthed = this.oauthService.hasValidAccessToken())
  }
}
