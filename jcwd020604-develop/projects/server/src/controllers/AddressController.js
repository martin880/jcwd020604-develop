const db = require("../models");
const axios = require("axios");
const Joi = require("joi");

const addressController = {
  getAllProvince: async (req, res) => {
    try {
      const result = await axios.get(
        "https://api.rajaongkir.com/starter/province",
        {
          headers: {
            key: process.env.RAJA_ONGKIR_API,
          },
        }
      );
      res.send(result.data.rajaongkir.results);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getAllCity: async (req, res) => {
    try {
      const result = await axios.get(
        "https://api.rajaongkir.com/starter/city",
        {
          headers: {
            key: process.env.RAJA_ONGKIR_API,
          },
        }
      );
      res.send(result.data.rajaongkir.results);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },

  getCityfromProvince: async (req, res) => {
    try {
      const provinceId = req.params.province_id;
      const result = await axios.get(
        `https://api.rajaongkir.com/starter/city`,
        {
          headers: {
            key: process.env.RAJA_ONGKIR_API,
          },
          params: {
            province: provinceId,
          },
        }
      );
      res.send(result.data.rajaongkir.results);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },

  getAddressById: async (req, res) => {
    try {
      const addressId = req.params.id;
      const address = await db.addresses.findByPk(addressId);

      if (!address) {
        return res.status(404).json({ error: "Address not found" });
      }

      return res.status(200).json(address);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  getAddressByUserId: async (req, res) => {
    try {
      const response = await db.addresses.findAll({
        where: {
          user_id: req.params.id,
        },
      });
      res.status(200).send(response);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  editAddress: async (req, res) => {
    const { address, province, city, city_id, district } = req.body;
    const { id } = req.params;
    const t = await db.sequelize.transaction();

    const schema = Joi.object({
      address: Joi.string().required(),
      province: Joi.string().required(),
      city: Joi.string().required(),
      city_id,
      district: Joi.string().required(),
    });

    const validation = schema.validate({
      address,
      province,
      city,
	    city_id,
      district,
    });

    if (validation.error) {
      return res
        .status(400)
        .send({ message: validation.error.details[0].message });
    }

    try {
      const existingAddress = await db.addresses.findOne({
        where: { address, user_id: req.user.id },
      });

      if (existingAddress?.dataValues?.id != id && existingAddress != null) {
        return res
          .status(400)
          .send({ message: "Address name already exists." });
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

      await db.addresses.update(
        {
          address,
          province,
          city,
		      city_id,
          district,
          latitude: lat,
          longitude: lng,
        },
        { where: { id }, returning: true, transaction: t }
      );

      await t.commit();
      res.status(200).send({ message: "Address updated successfully." });
    } catch (err) {
      await t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },

  deleteAddress: async (req, res) => {
    const { id } = req.params;
    const t = await db.sequelize.transaction();

    try {
      const address = await db.addresses.findOne({ where: { id } });
      if (!address) {
        return res.status(404).send({ message: "Address not found." });
      }

      await db.addresses.destroy({
        where: { id: id },
        transaction: t,
      });

      await t.commit();
      res.send({ message: "Address deleted successfully." });
    } catch (err) {
      await t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },
};
module.exports = addressController;
