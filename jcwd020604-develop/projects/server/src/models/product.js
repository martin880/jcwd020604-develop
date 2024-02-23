const { customAlphabet } = require("nanoid");

const alphabet =
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 10);

module.exports = (sequelize, Sequelize) => {
	const products = sequelize.define(
		"products",
		{
			uuid: {
				type: Sequelize.STRING(10),
				defaultValue: () => nanoid(),
			},
			product_name: Sequelize.STRING,
			product_detail: Sequelize.TEXT,
			price: Sequelize.INTEGER,
			weight: Sequelize.INTEGER,
		},
		{
			paranoid: true,
		}
	);
	return products;
};
