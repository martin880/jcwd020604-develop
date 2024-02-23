module.exports = (sequelize, Sequelize) => {
	const stock_histories = sequelize.define(
		"stock_histories",
		{
			stock_before: Sequelize.INTEGER,
			stock_after: Sequelize.INTEGER,
			qty: Sequelize.INTEGER,
			status: Sequelize.ENUM("IN", "OUT"),
			reference: Sequelize.STRING,
		},
		{
			paranoid: true,
		}
	);
	return stock_histories;
};
