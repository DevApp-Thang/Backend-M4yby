const asyncHandle = require("../middlewares/asyncHandle");
const { PlaceOfRendering } = require("../models");

module.exports = {
  getAll: asyncHandle(async (req, res, next) => {
    const data = await PlaceOfRendering.findAll({
      attributes: ["id", "name"],
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data,
    });
  }),
};
