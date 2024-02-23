const db = require("../models");

const autoMutation = {
	autoMutation: async (requestedWarehouse, nearestWarehouse, qty, t) => {
		try {
			if (nearestWarehouse) {
				if (qty <= nearestWarehouse.warehouse.dataValues.stocks[0].qty) {
					await db.stocks.update(
						{ qty: nearestWarehouse.warehouse.dataValues.stocks[0].qty - qty },
						{
							where: { id: nearestWarehouse.warehouse.dataValues.stocks[0].id },
							transaction: t,
						}
					);

					await db.stocks.update(
						{ qty: requestedWarehouse.dataValues.qty + qty },
						{
							where: { id: requestedWarehouse.dataValues.id },
							transaction: t,
						}
					);

					const mutation = await db.stock_mutations.create(
						{
							qty: qty,
							stock_id: requestedWarehouse.dataValues.id,
							to_warehouse_id: requestedWarehouse.dataValues.warehouse_id,
							from_warehouse_id: nearestWarehouse.warehouse.dataValues.id,
							status: "AUTO",
						},
						{ transaction: t }
					);

					await db.stock_histories.create(
						{
							qty: -qty,
							status: "OUT",
							reference: `Auto ${mutation.mutation_code}`,
							stock_id: nearestWarehouse.warehouse.dataValues.stocks[0].id,
							stock_before: nearestWarehouse.warehouse.dataValues.stocks[0].qty,
							stock_after:
								nearestWarehouse.warehouse.dataValues.stocks[0].qty - qty,
						},
						{ transaction: t }
					);

					await db.stock_histories.create(
						{
							qty: qty,
							status: "IN",
							reference: `Auto ${mutation.mutation_code}`,
							stock_id: requestedWarehouse.dataValues.id,
							stock_before: requestedWarehouse.dataValues.qty,
							stock_after: requestedWarehouse.dataValues.qty + qty,
						},
						{ transaction: t }
					);
					return mutation;
				} else {
					console.log(
						`Insufficient stock in ${nearestWarehouse.warehouse.dataValues.warehouse_name}.`
					);
				}
			}
		} catch (err) {
			await t.rollback();
			throw err;
		}
	},
};

module.exports = autoMutation;
