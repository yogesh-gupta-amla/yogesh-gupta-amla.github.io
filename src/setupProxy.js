const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      //   target: "http://localhost:3000",
      target: "https://https://webstore-klrt-np.znodecorp.com",
      changeOrigin: true,
      secure: false,
      logLevel: "debug", // 👈 add debug logs
    })
  );
};
