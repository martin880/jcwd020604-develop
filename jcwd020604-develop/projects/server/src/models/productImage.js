module.exports = (sequelize, Sequelize) => {
	const product_images = sequelize.define("product_images", {
		product_image: {
			type: Sequelize.STRING,
			defaultValues: null,
		},
	});
	return product_images;
};
