module.exports = (sequelize, Sequelize) => {
	const users = sequelize.define(
		"users",
		{
			uuid:{
				type: Sequelize.STRING,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				validate: {
					notEmpty: true,
				}
			},
			email: {
				type: Sequelize.STRING,
				unique: true,
			},
			phone_number: {
				type: Sequelize.STRING,
				validate: {
					isNumeric: true,
					len: [0, 12]
				}
			},
			password: Sequelize.STRING,
			fullname: Sequelize.STRING,
			avatar_url: Sequelize.STRING,
			role: Sequelize.ENUM("USER", "W_ADMIN", "ADMIN"),
			verified: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
		},
		{
			paranoid: true,
		}
	);
	return users;
};
