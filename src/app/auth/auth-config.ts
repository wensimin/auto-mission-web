import {AuthConfig, OAuthModuleConfig, OAuthService, OAuthStorage} from 'angular-oauth2-oidc';
import {environment} from "../../environments/environment";


export const authConfig: AuthConfig = {
  issuer: environment.authSever,
  clientId: 'auto-mission', // The "Auth Code + PKCE" client
  responseType: 'code',
  redirectUri: window.location.origin + "/auto-mission-web/",
  dummyClientSecret: '753951anna',
  scope: 'openid profile', // Ask offline_access to support refresh token refreshes
  useHttpBasicAuth: true,
  revocationEndpoint: environment.authSever + '/oauth2/revoke',
  tokenEndpoint: environment.authSever + '/oauth2/token',
  showDebugInformation: true, // Also requires enabling "Verbose" level in devtools
  requireHttps: false,
  userinfoEndpoint: environment.authSever + "/userinfo",
  timeoutFactor: 0.9
};

export const authModuleConfig: OAuthModuleConfig = {
  resourceServer: {
    allowedUrls: [environment.resourceServer],
    sendAccessToken: true,
  },
};

export function storageFactory(): OAuthStorage {
  return localStorage;
}

export function authAppInitializerFactory(oAuthService: OAuthService) {
  return () => oAuthService.loadDiscoveryDocumentAndTryLogin()
}
