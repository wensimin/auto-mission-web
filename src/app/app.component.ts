import {Component, ViewChild} from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";
import {LoadingService} from "./service/loading.service";
import {firstValueFrom} from "rxjs";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSidenav} from "@angular/material/sidenav";
import {MatButton} from "@angular/material/button";
import {FocusMonitor} from "@angular/cdk/a11y";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isAuthed = false
  username = null
  loading = this.loadService.isLoading()
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  @ViewChild('menu') menu!: MatButton;

  constructor(
    private oauthService: OAuthService,
    private dialog: MatDialog,
    private loadService: LoadingService,
    private focusMonitor: FocusMonitor
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

  closeNav() {
    this.sidenav.close().then()
    // 去除menu按钮的焦点样式
    this.focusMonitor.stopMonitoring(this.menu._elementRef.nativeElement);
  }
}
