const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/gw/admin',
    createProxyMiddleware({
      target: 'http://192.168.0.124',
      changeOrigin: true,
    }),
  );
  app.use(
    '/proxy',
    createProxyMiddleware({
      target: 'http://192.168.0.124',
      changeOrigin: true,
    }),
  );
  app.use(
    '/images',
    createProxyMiddleware({
      target: 'http://192.168.0.124',
      changeOrigin: true,
    }),
  );
  app.use(
    '/upload',
    createProxyMiddleware({
      target: 'http://192.168.0.124',
      changeOrigin: true,
    }),
  );
};