const db = require("../models");
const Joi = require("joi");
const { Op } = require("sequelize");

const salesReport = {
  getData: async (req, res) => {
    const { dateFrom, dateTo, warehouse_id } = req.body;
    let where = {
      "$orders.status$": { [Op.in]: ["PROCESSING", "DONE"] },
      "$orders.createdAt$": { [Op.between]: [dateFrom, dateTo] },
    };
    if (warehouse_id) {
      where["$orders.warehouse_id$"] = warehouse_id;
    }
    try {
      const dataReport = await db.order_details.findAndCountAll({
        include: [
          { model: db.orders, as: "orders" },
          {
            model: db.stocks,
            include: [
              {
                model: db.products,
                include: [{ model: db.categories, as: "category" }],
              },
            ],
          },
        ],
        where: where,
      });
      res
        .status(200)
        .send({ message: "sukses ambil data", data: dataReport.rows });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};
module.exports = salesReport;
