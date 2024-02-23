const db = require("../models");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const moment = require("moment");
const mailer = require("../lib/mailer");
const fs = require("fs").promises;
const handlebars = require("handlebars");
const { where } = require("sequelize");
const Joi = require("joi");
const path = require("path");

const passwordController = {
    resetPassword: async (req, res) => {
		try {
			const { email } = req.body;
			const findEmail = await db.users.findOne({ where: { email } });

			if (!findEmail) {
				throw new Error("Username or email not found");
			} else {
				const generateToken = nanoid();
				const token = await db.tokens.create({
					expired: moment().add(1, "days").format(),
					token: generateToken,
					userId: JSON.stringify({ id: findEmail.dataValues.id }),
					status: "FORGOT-PASSWORD",
				});

				const template = await fs.readFile(path.join(__dirname, "../template/resetPassword.html"), "utf-8");

				let compiledTemplate = handlebars.compile(template);
				let resetPasswordTemplate = compiledTemplate({
					registrationLink: `${process.env.URL_RESET_PASSWORD}/reset-password/${token.dataValues.token}`,
				});


				mailer({
					subject: "Reset Password - Email Verification Link",
					to: email,
					text: resetPasswordTemplate,
				});

				return res.send({
					message: "Reset password berhasil",
				});
			}
		} catch (err) {
			return res.status(500).send(err.message);
		}
	},

	verifyV2: async (req, res) => {
		try {
			const { id } = req.user;
			const { token } = req.query;
			const { password } = req.body;
			const hashPassword = await bcrypt.hash(password, 10);

			await db.users.update(
				{ password: hashPassword, verified: 1 },
				{ where: { id } }
			);
			await db.tokens.update(
				{
					valid: false,
				},
				{
					where: {
						token,
					},
				}
			);
			return res.send({
				message: "password registered",
			});
		} catch (err) {
			return res.status(500).send(err.message);
		}
	},
};

module.exports = passwordController;