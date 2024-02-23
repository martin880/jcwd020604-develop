const db = require("../models");
const Joi = require("joi");
const { Op, or } = require("sequelize");
const autoMutation = require("../service/autoMutationService");
const warehouse = require("../models/warehouse");
const haversine = require("haversine");
const orderDetail = require("../models/orderDetail");

const handlePaymentController = {
	adminConfirmOrderPayment: async (req, res) => {
		const t = await db.sequelize.transaction();
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

			if (action === "accept") {
				if (order.status !== "WAITING_PAYMENT") {
					return res.status(400).json({
						message: "Invalid order status for confirmation proof of payment",
					});
				}

				let stockShortage;
				for (const orderDetail of order.order_details) {
					const stock = orderDetail.stock;
					const referenceWarehouse = stock;

					if (stock.qty < orderDetail.qty) {
						stockShortage = orderDetail.qty - stock.qty;
					}

					if (stockShortage) {
						const warehouses = await db.warehouses.findAll({
							include: [
								{
									model: db.stocks,
									where: {
										product_id: stock?.product_id,
										qty: {
											[Op.gte]: stockShortage,
										},
									},
								},
							],
						});

						const otherWarehouses = warehouses.filter(
							(warehouse) => warehouse.id !== referenceWarehouse.warehouse.id
						);

						let nearest = {};
						for (const warehouse of otherWarehouses) {
							const distance = haversine(
								{
									latitude: referenceWarehouse?.latitude,
									longitude: referenceWarehouse?.longitude,
								},
								{
									latitude: warehouse.latitude,
									longitude: warehouse.longitude,
								}
							);

							if (!nearest.distance || distance < nearest.distance) {
								nearest = { warehouse, distance };
							}
						}

						if (nearest) {
							await autoMutation.autoMutation(
								referenceWarehouse,
								nearest,
								stockShortage,
								t
							);

							await db.stocks.update(
								{
									qty: 0,
								},
								{ where: { id: referenceWarehouse.id }, transaction: t }
							);

							await db.stock_histories.create(
								{
									qty: -orderDetail.qty,
									status: "OUT",
									reference: order.invoice,
									stock_id: stock.id,
									stock_before: referenceWarehouse.qty,
									stock_after: 0,
								},
								{ transaction: t }
							);
						} else {
							return res.status(400).json({
								message:
									"No branch with sufficient stock found for stock mutation",
							});
						}
					} else {
						await db.stocks.update(
							{
								qty: referenceWarehouse.qty - orderDetail.qty,
							},
							{ where: { id: referenceWarehouse.id }, transaction: t }
						);
						await db.stock_histories.create(
							{
								qty: -orderDetail.qty,
								status: "OUT",
								reference: order.invoice,
								stock_id: stock.id,
								stock_before: referenceWarehouse.qty,
								stock_after: referenceWarehouse.qty - orderDetail.qty,
							},
							{ transaction: t }
						);
					}
				}

				await t.commit();
				order.status = "PROCESSING";
				await order.save();

				return res.status(200).json({
					message: "Payment received, order status updated to Processed",
				});
			} else if (action === "reject") {
				if (order.status !== "WAITING_PAYMENT") {
					return res.status(400).json({
						message: "Invalid order status to refuse proof of payment",
					});
				}

				order.status = "WAITING_PAYMENT";
				await order.save();

				return res.status(200).json({
					message:
						"Payment is rejected, order status is updated to Waiting for Payment",
				});
			} else {
				return res.status(400).json({ message: "Invalid action" });
			}
		} catch (error) {
			await t.rollback();
			return res
				.status(500)
				.json({ message: "There was an error while processing the payment" });
		}
	},
};

module.exports = handlePaymentController;
