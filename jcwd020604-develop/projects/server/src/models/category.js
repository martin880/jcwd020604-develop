module.exports = (sequelize, Sequelize) => {
	const categories = sequelize.define(
		"categories",
		{
			category_name: Sequelize.STRING,
		},
		{
			paranoid: true,
		}
	);
	return categories;
};
