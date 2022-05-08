export const environment = {
  production: true,
  authSever: process.env.NG_APP_DOMAIN + 'authorization',
  resourceServer: process.env.NG_APP_DOMAIN + 'auto-mission',
  wsServer: process.env.NG_APP_DOMAIN.replace("https", "wss") + 'auto-mission'
};
