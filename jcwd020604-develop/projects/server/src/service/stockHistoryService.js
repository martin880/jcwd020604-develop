const db = require("../models");

const stockHistory = {
	addStockHistory: async (dataStock, status, reference, qty) => {
		const t = await db.sequelize.transaction();

		try {
			const newHistory = await db.stock_histories.create(
				{
					qty: qty - dataStock.qty,
					status,
					reference,
					stock_id: dataStock.id,
					stock_before: dataStock.qty,
					stock_after: qty,
				},
				{ transaction: t }
			);
			await t.commit();
			return newHistory;
		} catch (err) {
			await t.rollback();
			throw err;
		}
	},
};

module.exports = stockHistory;
