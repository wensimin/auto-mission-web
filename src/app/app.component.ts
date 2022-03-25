import {Component} from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";
import {LoadingService} from "./service/loading.service";
import {firstValueFrom} from "rxjs";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isAuthed = false
  username = null
  loading = this.loadService.isLoading()

  constructor(
    private oauthService: OAuthService,
    private dialog: MatDialog,
    private loadService: LoadingService
  ) {
    this.loadAuth()
  }

  private loadAuth() {
    this.isAuthed = this.oauthService.hasValidAccessToken()
    // @ts-ignore
    this.username = this.isAuthed ? this.oauthService.getIdentityClaims()["sub"] : null
  }

  login() {
    this.oauthService.initLoginFlow()
  }

  async logout() {
    let confirm = await firstValueFrom(this.dialog.open(ConfirmDialogComponent, {
      data: `确认注销吗?`
    }).afterClosed()).then()
    if (!confirm) return
    this.oauthService.revokeTokenAndLogout().then(() => this.isAuthed = this.oauthService.hasValidAccessToken())
  }
}
