module.exports = (sequelize, Sequelize) => {
  const orders = sequelize.define(
    "orders",
    {
      payment_detail: Sequelize.STRING,
      payment_proof: Sequelize.STRING,
      invoice: Sequelize.STRING,
      shipping_cost: Sequelize.INTEGER,
      total_price: Sequelize.INTEGER,
      courier: Sequelize.ENUM("jne", "pos", "tiki"),
      shipping_cost: Sequelize.INTEGER,
      total_price: Sequelize.INTEGER,
      status: Sequelize.ENUM(
        "PAYMENT",
        "WAITING_STOCK_TRANSFER",
        "WAITING_PAYMENT",
        "PROCESSING",
        "DELIVERY",
        "CANCELLED",
        "DONE"
      ),
    },
    {
      paranoid: false,
      hooks: {
        beforeCreate: (order_detail) => {
          const now = new Date();
          const formattedDate = formatDate(now);
          const formattedTime = formatTime(now);
          order_detail.invoice = `Invoice: ${formattedDate}${formattedTime}`;
        },
      },
    }
  );
  return orders;
};

// Helper functions to format date and time
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}${month}${year}`;
}

function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}${minutes}${seconds}`;
}
