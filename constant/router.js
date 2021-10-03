const { APIEnum } = require("./api-enum");
const authRouter = require("../routes/authRouter");
const itemRouter = require("../routes/itemRouter");
const categoryRouter = require("../routes/categoryRouter");
const subCategoryRouter = require("../routes/subCategoryRouter");
const searchHistoryRouter = require("../routes/searchHistoryRouter");
const favoriteRouter = require("../routes/favoriteRouter");
const productRouter = require("../routes/productRouter");
const typeOfServiceRouter = require("../routes/typeOfServiceRouter");
const priceIndicatedRouter = require("../routes/priceIndicatedRouter");
const placeOfRenderRouter = require("../routes/placeOfRenderRouter");
const rateRouter = require("../routes/rateRouter");

module.exports = [
  {
    router: authRouter,
    endpoint: APIEnum.AUTH,
  },
  {
    router: itemRouter,
    endpoint: APIEnum.ITEM,
  },
  {
    router: categoryRouter,
    endpoint: APIEnum.CATEGORY,
  },
  {
    router: subCategoryRouter,
    endpoint: APIEnum.SUB_CATEGORY,
  },
  {
    router: searchHistoryRouter,
    endpoint: APIEnum.SEARCH_HISTORY,
  },
  {
    router: favoriteRouter,
    endpoint: APIEnum.FAVORITE,
  },
  {
    router: productRouter,
    endpoint: APIEnum.PRODUCT,
  },
  {
    router: typeOfServiceRouter,
    endpoint: APIEnum.TYPE_OF_SERVICE,
  },
  {
    router: priceIndicatedRouter,
    endpoint: APIEnum.PRICE_INDICATED,
  },
  {
    router: placeOfRenderRouter,
    endpoint: APIEnum.PLACE_OF_RENDERING,
  },
  {
    router: rateRouter,
    endpoint: APIEnum.RATE,
  },
];
