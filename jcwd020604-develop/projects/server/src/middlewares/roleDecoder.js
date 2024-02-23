const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

const checkRole = {
	checkUserOnly: async (req, res, next) => {
		try {
			const token = req.headers.authorization.split(" ")[1];
			const findToken = await db.tokens.findOne({
				where: {
					[Op.and]: [
						{ token },

						{
							expired: {
								[Op.gte]: moment().format(),
							},
						},
						{ valid: true },
					],
				},
			});

			if (!findToken) {
				throw new Error("token expired");
			}
			const user = await db.users.findOne({
				where: {
					id: JSON.parse(findToken?.dataValues?.userId).id,
				},
			});
			if (user.role != "USER") {
				return res.status(401).send({
					message: "You do not have permissions to access",
				});
			}
			delete user.dataValues.password;
			req.user = user.dataValues;
			next();
		} catch (err) {
			return res.status(500).send({ message: err.message });
		}
	},
	checkUser: async (req, res, next) => {
		try {
			const token = req.headers.authorization.split(" ")[1];
			const findToken = await db.tokens.findOne({
				where: {
					[Op.and]: [
						{ token },

						{
							expired: {
								[Op.gte]: moment().format(),
							},
						},
						{ valid: true },
					],
				},
			});

			if (!findToken) {
				throw new Error("token expired");
			}
			const user = await db.users.findOne({
				where: {
					id: JSON.parse(findToken?.dataValues?.userId).id,
				},
			});
			if (
				user.role != "W_ADMIN" &&
				user.role != "ADMIN" &&
				user.role != "USER"
			) {
				return res.status(401).send({
					message: "You do not have permissions to access",
				});
			}
			delete user.dataValues.password;
			req.user = user.dataValues;
			next();
		} catch (err) {
			return res.status(500).send({ message: err.message });
		}
	},
	checkWAdmin: async (req, res, next) => {
		try {
			const token = req.headers.authorization.split(" ")[1];
			const findToken = await db.tokens.findOne({
				where: {
					[Op.and]: [
						{ token },

						{
							expired: {
								[Op.gte]: moment().format(),
							},
						},
						{ valid: true },
					],
				},
			});

			if (!findToken) {
				throw new Error("token expired");
			}
			const user = await db.users.findOne({
				where: {
					id: JSON.parse(findToken?.dataValues?.userId).id,
				},
			});
			if (user.role != "W_ADMIN" && user.role != "ADMIN") {
				return res.status(401).send({
					message: "You do not have permissions to access",
				});
			}
			delete user.dataValues.password;
			req.user = user.dataValues;
			next();
		} catch (err) {
			return res.status(500).send({ message: err.message });
		}
	},
	checkAdmin: async (req, res, next) => {
		try {
			const token = req.headers.authorization.split(" ")[1];
			const findToken = await db.tokens.findOne({
				where: {
					[Op.and]: [
						{ token },
						{
							expired: {
								[Op.gte]: moment().format(),
							},
						},
						{ valid: true },
					],
				},
			});

			if (!findToken) {
				throw new Error("token expired");
			}
			const user = await db.users.findOne({
				where: {
					id: JSON.parse(findToken?.dataValues?.userId).id,
				},
			});
			if (user.role != "ADMIN") {
				return res.status(401).send({
					message: "You do not have permissions to access",
				});
			}
			delete user.dataValues.password;
			req.user = user.dataValues;
			next();
		} catch (err) {
			return res.status(500).send({ message: err.message });
		}
	},
};

module.exports = checkRole;
