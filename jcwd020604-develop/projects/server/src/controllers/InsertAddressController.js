const db = require("../models");
const axios = require("axios");
const Joi = require("joi");

const insertAddressController = {
    insertAddress: async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
          const { user_id, address, district, city, province, city_id } = req.body;
          
          const existingAddress = await db.addresses.findOne({
            where: { address },
          });
    
          const user = await db.users.findByPk(user_id);
          if (!user) {
            return res.status(404).json({ error: "User not found." });
          }
    
          if (existingAddress) {
            throw new Error("Address with this name already exists.");
          }
    
          const response = await axios.get(
            "https://api.opencagedata.com/geocode/v1/json",
            {
              params: {
                q: `${address}, ${district}, ${province}, ${city}`,
                countrycode: "id",
                limit: 1,
                key: process.env.GEOCODE_API_KEY,
              },
            }
          );
    
          const { lat, lng } = response.data.results[0].geometry;
    
          const addresses = await db.addresses.create(
            {
              user_id,
              address,
              province,
              city,
              city_id,
              district,
              latitude: lat,
              longitude: lng,
            },
            { transaction: t }
          );
          await t.commit();
          res.send({ message: "Address added" });
        } catch (err) {
          await t.rollback();
          return res.status(500).send({ message: err.message });
        }
    },

    insertUsersAddress: async (req, res) => {
        const t = await db.sequelize.transaction();
        try {
          const { user_id, address, district, city, province, city_id } = req.body;
          const existingAddress = await db.addresses.findOne({
            where: { address },
          });
    
          if (existingAddress) {
            throw new Error("Address with this name already exists.");
          }
          
          const user = await db.users.findByPk(user_id);
          if (!user) {
            return res.status(404).json({ error: "User not found." });
          }

          const userAddressesCount = await db.addresses.count({
            where: { user_id },
          });
    
          if (userAddressesCount >= 4) {
            return res
              .status(400)
              .json({ message: "User already has 4 addresses. Cannot add more." });
          }
    
          const response = await axios.get(
            "https://api.opencagedata.com/geocode/v1/json",
            {
              params: {
                q: `${address}, ${district}, ${province}, ${city}`,
                countrycode: "id",
                limit: 1,
                key: process.env.GEOCODE_API_KEY,
              },
            }
          );
    
          const { lat, lng } = response.data.results[0].geometry;
    
          const addresses = await db.addresses.create(
            {
              user_id,
              address,
              province,
              city,
              city_id,
              district,
              latitude: lat,
              longitude: lng,
            },
            { transaction: t }
          );
          await t.commit();
          res.send({ message: "Address added" });
        } catch (err) {
          await t.rollback();
          return res.status(500).send({ message: err.message });
        }
    },
}

module.exports = insertAddressController;