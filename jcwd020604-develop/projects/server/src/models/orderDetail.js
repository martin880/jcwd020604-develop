module.exports = (sequelize, Sequelize) => {
  const order_details = sequelize.define(
    "order_details",
    {
      qty: Sequelize.STRING,
      price: Sequelize.INTEGER,
    },
    {
      paranoid: true,
    }
  );
  return order_details;
};
