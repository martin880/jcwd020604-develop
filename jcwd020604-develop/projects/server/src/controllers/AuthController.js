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

const authController = {
    register: async (req, res) => {
        try {
            const { email } = req.body;
    
            const findEmail = await db.users.findOne({ where: { email } });
            if (findEmail) {
                throw new Error("Username or email not found");
            } else {
                const createAccount = await db.users.create({
                    email,
                });
                const generateToken = nanoid();
                const token = await db.tokens.create({
                    expired: moment().add(1, "days").format(),
                    token: generateToken,
                    userId: JSON.stringify({ id: createAccount.dataValues.id }),
                    status: "VERIFY",
                });
                
                const template = await fs.readFile(path.join(__dirname, "../template/register.html"), "utf-8");

                let compiledTemplate = handlebars.compile(template);
                let registerTemplate = compiledTemplate({
                    registrationLink: `${process.env.URL_REGISTER}/verify`,
                    email,
                    token: token.dataValues.token,
                });
                mailer({
                    subject: "email verification link",
                    to: email,
                    text: registerTemplate,
                });
    
                return res.send({
                    message: "your account has been registered",
                });
            }
        } catch (err) {
            return res.status(500).send(err.message);
        }
    },
    
    verify: async (req, res) => {
        try {
            const { email, password, fullname } = req.body;
            const hashPassword = await bcrypt.hash(password, 10);
    
            await db.users.update(
                { password: hashPassword, fullname, verified: 1, role: "USER" },
                { where: { email } }
            );
    
            return res.send({
                message: "email registered",
            });
        } catch (err) {
            return res.status(500).send(err.message);
        }
    },
    
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
    
            const user = await db.users.findOne({
                where: {
                    email,
                },
            });
    
            if (!user) {
                throw new Error("Username or email not found");
            }
    
            if (!user.dataValues.verified) {
                throw new Error("email not verified");
            }
    
            const match = await bcrypt.compare(password, user.dataValues.password);
    
            if (!match) {
                throw new Error("Wrong password");
            }
    
            const userId = { id: user.dataValues.id };
            let token = await db.tokens.findOne({
                where: {
                    userId: JSON.stringify(userId),
                    expired: {
                        [db.Sequelize.Op.gte]: moment().format(),
                    },
                    valid: true,
                    status: "LOGIN",
                },
            });
    
            const generateToken = nanoid();
            if (!token) {
                token = await db.tokens.create({
                    expired: moment().add(1, "d").format(),
                    token: generateToken,
                    userId: JSON.stringify(userId),
                    status: "LOGIN",
                });
            } else {
                const token = await db.tokens.update(
                    {
                        expired: moment().add(1, "days").format(),
                        token: generateToken,
                    },
                    {
                        where: {
                            userId: JSON.stringify(userId),
                            status: "LOGIN",
                        },
                    }
                );
            }
            return res.status(200).send({
                message: "Success login",
                token: generateToken,
                data: user.dataValues,
            });
        } catch (err) {
            return res.status(500).send(err.message);
        }
    },
    
    getByTokenV2: async (req, res, next) => {
        try {
            const { password } = req.body;
            let token = req.headers.authorization;
            token = token.split(" ")[1];
            let p = await db.tokens.findOne({
                where: {
                    [db.Sequelize.Op.and]: [
                        { token },
                        {
                            expired: {
                                [db.Sequelize.Op.gt]: moment("00:00:00", "hh:mm:ss").format(),
                            },
                        },
                        {
                            valid: true,
                        },
                    ],
                },
            });
            if (!p) {
                throw new Error("token has expired");
            }
            user = await db.users.findOne({
                where: {
                    id: JSON.parse(p?.dataValues?.userId).id,
                },
            });
            delete user.dataValues.password;
            req.user = user;
            next();
        } catch (err) {
            return res.status(500).send({ message: err.message });
        }
    },
    
    getUserByToken: async (req, res) => {
        res.send(req.user);
    },
};

module.exports = authController;