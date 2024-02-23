const db = require("../models");
const Joi = require("joi");
const { Op } = require("sequelize");

const userOrdersController = {
  getAllOrder: async (req, res) => {
    try {
      const { status, warehouse_id } = req.query;
      const limit = 3;
      const page = req?.query?.page || 1;
      let offset = (parseInt(page) - 1) * limit;
      let whereClause = {};
      if (status) {
        whereClause["$status$"] = {
          [Op.like]: `${status}`,
        };
      }
      if (warehouse_id) {
        whereClause["$orders.warehouse_id$"] = {
          [Op.like]: `${warehouse_id}`,
        };
      }
      const orders = await db.orders.findAndCountAll({
        where: {
          ...whereClause,
        },
        include: [
          {
            model: db.order_details,
            include: [
              {
                model: db.stocks,
                include: [
                  {
                    model: db.products,
                    include: [{ model: db.product_images }],
                  },
                  { model: db.warehouses },
                ],
              },
            ],
          },
          { model: db.users, include: [{ model: db.addresses }] },
        ],
        distinct: true,
      });
      res.status(200).json({
        count: orders.count,
        rows: orders.rows.slice(offset, limit * page),
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving order", error: error.message });
    }
  },
  getOrderByUser: async (req, res) => {
    try {
      const { user_id } = req.params;
      const limit = 3;
      const page = req?.query?.page || 1;
      let offset = (parseInt(page) - 1) * limit;
      const orders = await db.orders.findAndCountAll({
        where: {
          user_id,
        },
        include: [
          {
            model: db.order_details,
            include: [
              {
                model: db.stocks,
                include: [
                  {
                    model: db.products,
                    include: [{ model: db.product_images, limit: 1 }],
                  },
                  { model: db.warehouses },
                ],
              },
            ],
          },
          { model: db.users, include: [{ model: db.addresses }] },
        ],
        distinct: true,
      });
      res.status(200).json({
        count: orders.count,
        rows: orders.rows.slice(offset, limit * page),
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving order", error: error.message });
    }
  },
  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await db.orders.findOne({
        where: { id },
        include: [
          {
            model: db.order_details,
            include: [
              {
                model: db.stocks,
                include: [
                  {
                    model: db.products,
                    include: [{ model: db.product_images }],
                  },
                  { model: db.warehouses },
                ],
              },
            ],
          },
          { model: db.users, include: [{ model: db.addresses }] },
        ],
      });
      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving order", error: error.message });
    }
  },
  createOrderByUser: async (req, res) => {
    const t = await db.sequelize.transaction();
    const {
      payment_detail,
      // payment_proof,
      //   invoice,
      shipping_cost,
      total_price,
      courier,
      status,
      user_id,
      address_id,
    } = req.body;
    const orderSchema = Joi.object({
      payment_detail: Joi.string().required(),
      // payment_proof: Joi.string().required(),
      //   invoice: Joi.string().required(),
      shipping_cost: Joi.number().required(),
      total_price: Joi.number().required(),
      courier: Joi.string().required(),
      status: Joi.string().required(),
      user_id: Joi.number().required(),
      address_id: Joi.number().required(),
    });
    const validation = orderSchema.validate({
      payment_detail,
      // payment_proof,
      //   invoice,
      shipping_cost,
      total_price,
      courier,
      status,
      user_id,
      address_id,
    });
    if (validation.error) {
      return res
        .status(400)
        .send({ message: validation.error.details[0].message });
    }
    try {
      const newOrder = await db.orders.create(
        { ...req.body, warehouse_id: req.closestWarehouse.id },
        {
          transaction: t,
        }
      );
      const cartItems = await db.carts.findAll({ where: { user_id } });
      const orderDetails = [];
      for (const cartItem of cartItems) {
        const { qty, price } = cartItem.dataValues;
        const [stock, created] = await db.stocks.findOrCreate({
          where: {
            warehouse_id: req.closestWarehouse.id,
            product_id: cartItem.product_id,
          },
          defaults: {
            qty: 0,
          },
          transaction: t,
        });
        const orderDetail = {
          qty,
          price,
          stock_id: stock.id,
          order_id: newOrder.id,
        };
        orderDetails.push(orderDetail);
      }
      await db.order_details.bulkCreate(orderDetails, { transaction: t });
      await db.carts.destroy({ where: { user_id } });

      await t.commit();
      res.status(201).json(newOrder);
    } catch (error) {
      await t.rollback();
      console.error("Error creating order:", error);
      res
        .status(400)
        .json({ message: "Error creating order", error: error.message });
    }
  },
  createOrderDetail: async (req, res) => {
    const t = await db.sequelize.transaction();
    const { qty, price, stock_id, order_id } = req.body;
    const orderSchema = Joi.object({
      qty: Joi.number().required(),
      price: Joi.number().required(),
      stock_id: Joi.number().required(),
      order_id: Joi.number().required(),
    });
    const validation = orderSchema.validate({
      qty,
      price,
      stock_id,
      order_id,
    });
    if (validation.error) {
      return res
        .status(400)
        .send({ message: validation.error.details[0].message });
    }
    try {
      const existingOrder = await db.order_details.findOne({
        where: { order_id },
        include: [{ model: db.stocks }],
      });
      if (existingOrder) {
        throw new Error("Orders with the same name already exists");
      }
      const newOrder = await db.order_details.create(req.body, {
        transaction: t,
      });
      await t.commit();
      res.status(201).json(newOrder);
    } catch (error) {
      await t.rollback();
      res
        .status(400)
        .json({ message: "Error creating order", error: error.message });
    }
  },
  getOrderDetailById: async (req, res) => {
    try {
      const { id } = req.params;
      const order_detail = await db.order_details.findOne({
        where: { id },
        include: [{ model: db.stocks }],
      });
      if (order_detail) {
        res.status(200).json(order_detail);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving order", error: error.message });
    }
  },
  updateOrder: async (req, res) => {
    const { id } = req.params;
    const {
      payment_detail,
      payment_proof,
      invoice,
      shipping_cost,
      total_price,
      courier,
      status,
      user_id,
      address_id,
    } = req.body;
    const t = await db.sequelize.transaction();
    try {
      const [updatedRows] = await db.orders.update(req.body, {
        where: { id: id },
        transaction: t,
      });
      if (updatedRows > 0) {
        await t.commit();
        res.status(200).json({ message: "Order updated successfully" });
      } else {
        await t.rollback();
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      await t.rollback();
      res
        .status(500)
        .json({ message: "Error updating order", error: error.message });
    }
  },
  deleteOrder: async (req, res) => {
    const { id } = req.params;
    const t = await db.sequelize.transaction();
    try {
      const order = await db.orders.findOne({ where: { id } });
      if (!order) {
        return res.status(404).send({ message: "Orders not found." });
      }
      await db.orders.destroy({
        where: { id: id },
        transaction: t,
      });
      await t.commit();
      res.send({ message: "Orders deleted successfully." });
    } catch (err) {
      await t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },
  deleteOrderByUser: async (req, res) => {
    const { id } = req.params;
    const t = await db.sequelize.transaction();
    try {
      const order = await db.orders.findOne({ where: { id } });
      if (!order) {
        return res.status(404).send({ message: "Orders not found." });
      }
      await db.orders.update(
        { status: "CANCELLED" },
        {
          where: { id: id },
          transaction: t,
        }
      );
      await t.commit();
      res.send({ message: "Orders deleted successfully." });
    } catch (err) {
      await t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },
  userDone: async (req, res) => {
    try {
      const { id } = req.params;
      const { action } = req.body;
      const order = await db.orders.findOne({
        where: { id },
        include: [
          {
            model: db.order_details,
            include: [
              {
                model: db.stocks,
                include: [
                  {
                    model: db.products,
                    include: [{ model: db.product_images }],
                  },
                  { model: db.warehouses },
                ],
              },
            ],
          },
          { model: db.users, include: [{ model: db.addresses }] },
        ],
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (action === "done") {
        if (order.status !== "DELIVERY") {
          return res
            .status(400)
            .json({ message: "Invalid order, Order has not been deliver" });
        }
        order.status = "DONE";
        await order.save();
        return res.status(200).json({ message: "Order has been arrived" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Invalid action" });
    }
  },
  paymentProofByUser: async (req, res) => {
    const { order_id } = req.params;
    const t = await db.sequelize.transaction();
    try {
      const update = await db.orders.update(
        {
          payment_proof: "paymentProof/" + req?.file?.filename,
          status: "WAITING_PAYMENT",
        },
        {
          where: { id: order_id },
          transaction: t,
        }
      );
      await t.commit();
      res.status(200).json({ message: "Order updated successfully" });
    } catch (error) {
      await t.rollback();
      res
        .status(500)
        .json({ message: "Error updating order", error: error.message });
    }
  },
};
module.exports = userOrdersController;
