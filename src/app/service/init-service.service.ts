import {Injectable} from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";

@Injectable({
  providedIn: 'root'
})
export class InitServiceService {

  constructor(private oauthService: OAuthService) {

  }

  async load() {
    console.log(`初始化前token ${this.oauthService.getAccessToken()}`)
    // 监听access_token进行刷新
    this.oauthService.setupAutomaticSilentRefresh({}, "access_token")
    // 当ac token 无效且拥有rf token时刷新
    if (!this.oauthService.hasValidAccessToken() && this.oauthService.getRefreshToken()) {
      // 等待获取新token后再加载其他部分
      await this.oauthService.refreshToken().catch(async () => {
        // 刷新token获取失败则退出登录
        await this.oauthService.revokeTokenAndLogout().then()
      })
    }
    console.log(`初始化后token ${this.oauthService.getAccessToken()}`)
  }
}
