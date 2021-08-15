const errorHandle = require("../middlewares/errorHandle");
const routers = require("../constant/router");

module.exports = (app) => {
  // define router
  routers.forEach((router) =>
    app.use(`/api/${router.endpoint}`, router.router)
  );

  // define error handle database
  app.use(errorHandle);

  // not found
  app.get("*", function (req, res) {
    return res.status(404).json({
      success: false,
      data: "API not found",
    });
  });
};
