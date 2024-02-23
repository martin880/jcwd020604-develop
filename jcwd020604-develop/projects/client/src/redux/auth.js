const init = {
	email: "",
	password: "",
};

function userReducer(state = init, action) {
	if (action.type === "login") {
		return {
			...state,
			id: action.payload.id,
			uuid: action.payload.uuid,
			fullname: action.payload.fullname,
			email: action.payload.email,
			phone_number: action.payload.phone_number,
			role: action.payload.role,
			avatar_url: action.payload.avatar_url,
			verified: action.payload.verified,
			warehouse_id: action.payload.warehouse_id,
			address: action.payload.address,
			cart: action.payload.cart,
		};
	} else if (action.type === "logout") {
		return init;
	}

	return state;
}

export default userReducer;
