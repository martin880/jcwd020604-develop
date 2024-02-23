module.exports = (sequelize, Sequelize) => {
	const stocks = sequelize.define(
		"stocks",
		{
			qty: Sequelize.INTEGER,
		},
		{
			paranoid: true,
		}
	);
	return stocks;
};
