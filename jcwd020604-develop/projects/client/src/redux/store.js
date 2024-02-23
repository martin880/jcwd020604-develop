import { combineReducers } from "redux";
import userReducer from "./auth";

const rootReducer = combineReducers({
  auth: userReducer,
});

export default rootReducer;
