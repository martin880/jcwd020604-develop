const db = require("../models");
const Joi = require("joi");
const { Op, or } = require("sequelize");
const autoMutation = require("../service/autoMutationService");
const warehouse = require("../models/warehouse");
const haversine = require("haversine");
const orderDetail = require("../models/orderDetail");

const handleActionOrderController = {
    adminSendOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const { send } = req.body;
    
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
    
            if (send === "send") {
                if (order.status !== "PROCESSING") {
                    return res
                        .status(400)
                        .json({ message: "Invalid order, Payment has not been paid" });
                }
    
                order.status = "DELIVERY";
                await order.save();
    
                return res
                    .status(200)
                    .json({ message: "Order status updated to Delivered" });
            } else if (send === "cancel") {
                if (order.status !== "PROCESSING") {
                    return res.status(400).json({ message: "Order mutation canceled" });
                }
    
                for (const orderDetail of order.order_details) {
                    const stock = orderDetail.stock;
                    const updatedQty =
                        parseInt(stock.qty) + parseInt(order.order_details[0].qty);
                    const qtyBefore =
                        parseInt(stock.qty) - parseInt(order.order_details[0].qty);
    
                    await db.stocks.update(
                        { qty: updatedQty },
                        { where: { id: stock.id } }
                    );
    
                    await db.stock_histories.create({
                        qty: parseInt(order.order_details[0].qty),
                        status: "IN",
                        reference: order.invoice,
                        stock_id: stock.id,
                        stock_before: qtyBefore,
                        stock_after: updatedQty,
                    });
                }
    
                order.status = "CANCELLED";
                await order.save();
    
                return res
                    .status(200)
                    .json({ message: "Order status updated to Delivered" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Invalid action" });
        }
    },
    
    adminCancelOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const order = await db.orders.findByPk(id);
    
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }
    
            if (
                order.status === "DELIVERY" ||
                order.status === "CANCELLED" ||
                order.status === "DONE"
            ) {
                return res
                    .status(400)
                    .json({ message: "Order cannot be cancelled at this status" });
            }
    
            order.status = "CANCELLED";
            await order.save();
    
            return res.status(200).json({ message: "Order cancelled successfully" });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "An error occurred while cancelling the order" });
        }
    },
}

module.exports = handleActionOrderController;
