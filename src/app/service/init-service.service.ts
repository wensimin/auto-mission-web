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
    let token: TokenResponse | void
    // 当ac token 无效且拥有rf token时刷新
    this.logger.debug(`token过期:${this.isAccessTokenExpired()}, 过期时间:${this.oauthService.getAccessTokenExpiration()}`)
    if (this.isAccessTokenExpired() && this.oauthService.getRefreshToken()) {
      this.logger.debug(`执行刷新token`)
      // 等待获取新token后再加载其他部分
      token = await this.oauthService.refreshToken().catch(async () => {
        // 刷新token获取失败则退出登录
        await this.oauthService.revokeTokenAndLogout().then()
      })
      this.logger.debug(`初始化后token ${token?.access_token}`)
    }
    this.logger.debug("完成初始化")
    // 监听access_token进行刷新
    this.oauthService.setupAutomaticSilentRefresh({}, "access_token")
    return token
  }

  // 原本的检查过期方法偏移量有问题,先使用自定义验证方法
  private isAccessTokenExpired(): Boolean {
    // custom check of token expiration to avoid bug in library: https://github.com/manfredsteyer/angular-oauth2-oidc/issues/1135
    const expiresAt = this.oauthService.getAccessTokenExpiration() as number | null; // can return null https://github.com/manfredsteyer/angular-oauth2-oidc/blob/12.1/projects/lib/src/oauth-service.ts#L2354
    return Date.now() > (expiresAt ?? 0) - (this.oauthService.clockSkewInSec ?? 0);
  }
}
