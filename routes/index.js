const errorHandle = require("../middlewares/errorHandle");
const authRouter = require("./authRouter");

const routers = [authRouter];

module.exports = (app) => {
  // define router
  routers.forEach((router) => app.use("/api", router));

  // define error handle database
  app.use(errorHandle);
};
