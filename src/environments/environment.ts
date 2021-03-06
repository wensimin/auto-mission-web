// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  authSever: 'https://shali.fun:3000/authorization',
  // authSever: 'http://auth-server:81/authorization',
  // resourceServer: 'http://127.0.0.1:8080/auto-mission',
  resourceServer: 'https://shali.fun:3000/auto-mission',
  wsServer: "ws://127.0.0.1:8080/auto-mission"
  // wsServer: "wss://shali.fun:3000/auto-mission"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
