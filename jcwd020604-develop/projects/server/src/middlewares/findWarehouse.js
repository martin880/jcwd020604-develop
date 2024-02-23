const db = require("../models");
const haversine = require("haversine");

const findClosestWarehouse = async (req, res, next) => {
  try {
    const address = await db.addresses.findOne({
      where: { id: req.body.addressId },
    });
    if (!address) {
      return res.status(404).send({ message: "User address not found" });
    }
    const warehouse = await db.warehouses.findAll();

    let closestWarehouse = null;
    let shortestDistance = Number.MAX_SAFE_INTEGER;

    warehouse.forEach((warehouse) => {
      const distance = haversine(address, {
        latitude: warehouse.latitude,
        longitude: warehouse.longitude,
      });
      if (distance < shortestDistance) {
        shortestDistance = distance;
        closestWarehouse = warehouse;
      }
    });

    req.closestWarehouse = closestWarehouse;
    next();
  } catch (err) {
    throw err;
  }
};
module.exports = { findClosestWarehouse };
