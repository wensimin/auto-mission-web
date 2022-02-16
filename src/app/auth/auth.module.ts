import {APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {AuthConfig, OAuthModule, OAuthModuleConfig, OAuthService, OAuthStorage} from "angular-oauth2-oidc";
import {authAppInitializerFactory, authConfig, authModuleConfig, storageFactory} from "./auth-config";


@NgModule({
  imports: [
    HttpClientModule,
    OAuthModule.forRoot()
  ],
  providers: [
  ]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        { provide: APP_INITIALIZER, useFactory: authAppInitializerFactory, deps: [OAuthService], multi: true },
        { provide: AuthConfig, useValue: authConfig },
        { provide: OAuthModuleConfig, useValue: authModuleConfig },
        { provide: OAuthStorage, useFactory: storageFactory },
      ]
    };
  }
  // FIXME 未能理解的代码,先注释试运行
  // constructor(@Optional() @SkipSelf() parentModule: AuthModule) {
  //   if (parentModule) {
  //     throw new Error('CoreModule is already loaded. Import it in the AppModule only');
  //   }
  // }
}
