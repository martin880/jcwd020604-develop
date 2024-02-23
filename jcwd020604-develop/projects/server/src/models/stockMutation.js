module.exports = (sequelize, Sequelize) => {
	const stock_mutations = sequelize.define(
		"stock_mutations",
		{
			mutation_code: Sequelize.STRING,
			qty: Sequelize.INTEGER,
			status: Sequelize.ENUM("APPROVED", "REJECTED", "PENDING", "AUTO"),
			from_warehouse_id: {
				type: Sequelize.INTEGER,
			},
			to_warehouse_id: {
				type: Sequelize.INTEGER,
			},
		},
		{
			paranoid: true,
			hooks: {
				beforeCreate: (mutation) => {
					const now = new Date();
					const formattedDate = formatDate(now);
					const formattedTime = formatTime(now);
					mutation.mutation_code = `Mut: ${formattedDate}${formattedTime}`;
				},
			},
		}
	);
	return stock_mutations;
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
