const asyncHandle = require("../middlewares/asyncHandle");
const { TypeOfService } = require("../models");

module.exports = {
  getAll: asyncHandle(async (req, res, next) => {
    const data = await TypeOfService.findAll({
      attributes: ["id", "name"],
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data,
    });
  }),
};
