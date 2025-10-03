const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:3000",
      // target: "https://webstore-klrt-dv.amla.io",
      changeOrigin: true,
      secure: false,
      logLevel: "debug", // 👈 add debug logs
    })
  );
};
