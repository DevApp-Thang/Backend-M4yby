const asyncHandle = require("../middlewares/asyncHandle");
const { Specification } = require("../models");

module.exports = {
  getSpecifications: asyncHandle(async (req, res, next) => {
    const { productId } = req.params;

    const specifications = await Specification.findAll({
      where: { ProductId: productId },
      include: "specificationDetails",
    });

    const newSpecifications = specifications.map((specification) => {
      const value = specification.specificationDetails.map(
        (detail) => detail.value
      );
      return { key: specification.name, value };
    });

    res
      .status(200)
      .json({ success: true, data: { specifications: newSpecifications } });
  }),
};
