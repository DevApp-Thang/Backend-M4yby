const { Report, Account } = require("../models");
const asyncHandle = require("../middlewares/asyncHandle");
const ErrorResponse = require("../helpers/ErrorResponse");

module.exports = {
  createReport: asyncHandle(async (req, res, next) => {
    const { content, reportableId } = req.body;

    if (req.user.id === reportableId) {
      return next(new ErrorResponse("Bạn không thể báo cáo chính mình.", 400));
    }

    const reportableAccount = await Account.findByPk(reportableId);

    if (!reportableAccount) {
      return next(new ErrorResponse(`Tài khoản không tồn tại.`));
    }

    const report = await Report.create({
      content,
      ReportableId: reportableId,
      ActorId: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: report,
    });
  }),
};
