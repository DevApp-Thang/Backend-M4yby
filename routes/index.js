const errorHandle = require("../middlewares/errorHandle");
const authRouter = require("./authRouter");
const itemRouter = require("./itemRouter");
const categoryRouter = require("./categoryRouter");
const subCategoryRouter = require("./subCategoryRouter");
const searchHistoryRouter = require("./searchHistoryRouter");
const favoriteRouter = require("./favoriteRouter");

const routers = [
  authRouter,
  itemRouter,
  categoryRouter,
  subCategoryRouter,
  searchHistoryRouter,
  favoriteRouter,
];

module.exports = (app) => {
  // define router
  routers.forEach((router) => app.use("/api", router));

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
