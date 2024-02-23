module.exports = (sequelize, Sequelize) => {
  const addresses = sequelize.define("addresses", {
    address: Sequelize.STRING,
    province: Sequelize.STRING,
    city: Sequelize.STRING,
    city_id: Sequelize.INTEGER,
    district: Sequelize.STRING,
    postal_code: Sequelize.STRING,
    latitude: Sequelize.STRING,
    longitude: Sequelize.STRING,
  });
  return addresses;
};
