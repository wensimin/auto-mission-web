import {Injectable} from '@angular/core';
import {OAuthService, TokenResponse} from "angular-oauth2-oidc";
import {NGXLogger} from "ngx-logger";

@Injectable({
  providedIn: 'root'
})
export class InitServiceService {

  constructor(private oauthService: OAuthService, private logger: NGXLogger) {

  }

  async load(): Promise<TokenResponse | void> {
    this.logger.debug(`初始化前token ${this.oauthService.getAccessToken()}`)
    // 监听access_token进行刷新
    this.oauthService.setupAutomaticSilentRefresh({}, "access_token")
    let token: TokenResponse | void
    // 当ac token 无效且拥有rf token时刷新
    this.logger.debug(`token有效:${this.oauthService.hasValidAccessToken()}, 过期时间:${this.oauthService.getAccessTokenExpiration()}`)
    if (!this.oauthService.hasValidAccessToken() && this.oauthService.getRefreshToken()) {
      this.logger.debug(`执行刷新token`)
      // 等待获取新token后再加载其他部分
      token = await this.oauthService.refreshToken().catch(async () => {
        // 刷新token获取失败则退出登录
        await this.oauthService.revokeTokenAndLogout().then()
      })
      this.logger.debug(`初始化后token ${token?.access_token}`)
    }
    this.logger.debug("完成初始化")
    return token
  }
}
