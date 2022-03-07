// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  authSever : 'https://shali.fun:3000/authorization',
// export const authSever = 'http://auth-server:9000'
  resourceServer :'http://127.0.0.1:8080/auto-mission'
  // export const authSever = 'http://127.0.0.1:81/authorization'
// export const authSever = 'http://auth-server:81/authorization'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
