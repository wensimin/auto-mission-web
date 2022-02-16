import {AuthConfig, OAuthModuleConfig, OAuthService, OAuthStorage} from 'angular-oauth2-oidc';
//TODO by BUILD ENV
const domain = 'https://boliboli.xyz:3000'
// const domain = 'http://localhost:81'
export const authSever = domain + '/authorization'

export const authConfig: AuthConfig = {
  issuer: authSever,
  clientId: 'testId', // The "Auth Code + PKCE" client
  responseType: 'code',
  redirectUri: window.location.origin + '/',
  dummyClientSecret: 'testSecret',
  scope: 'openid', // Ask offline_access to support refresh token refreshes
  useHttpBasicAuth: true,
  revocationEndpoint: authSever + '/oauth2/revoke',
  showDebugInformation: true, // Also requires enabling "Verbose" level in devtools
  requireHttps: false,
};

export const authModuleConfig: OAuthModuleConfig = {
  resourceServer: {
    allowedUrls: [domain + '/message-rs'],
    sendAccessToken: true,
  },
};

export function storageFactory(): OAuthStorage {
  return localStorage;
}

export function authAppInitializerFactory(authService: OAuthService) {
  return () => authService.loadDiscoveryDocumentAndTryLogin()
}
