import {Component} from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isAuthed = this.oauthService.hasValidAccessToken()
  username?

  constructor(private oauthService: OAuthService) {
    oauthService.setupAutomaticSilentRefresh({}, "access_token")
    // @ts-ignore
    this.username = this.isAuthed ? this.oauthService.getIdentityClaims().sub : null
    // if (!oauthService.hasValidAccessToken()) oauthService.refreshToken().then(r => {
    //   console.log(r)
    // })
    // if (this.isAuthed) {
    //   oauthService.loadUserProfile().then(r => {
    //     console.log("user info:" + r)
    //   })
    // }
    console.log(oauthService.getAccessToken())
    console.log(oauthService.hasValidAccessToken())
  }

  login() {
    this.oauthService.initLoginFlow()
  }

  logout() {
    this.oauthService.revokeTokenAndLogout().then(() => this.isAuthed = this.oauthService.hasValidAccessToken())
  }
}
