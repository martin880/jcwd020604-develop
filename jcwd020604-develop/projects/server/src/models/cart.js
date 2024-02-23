module.exports = (sequelize, Sequelize) => {
  const carts = sequelize.define(
    "carts",
    {
      user_id: Sequelize.INTEGER,
      product_id: Sequelize.INTEGER,
      qty: Sequelize.INTEGER,
      price: Sequelize.INTEGER,
      subtotal: Sequelize.INTEGER,
    },
    {
      paranoid: false,
    }
  );
  return carts;
};
