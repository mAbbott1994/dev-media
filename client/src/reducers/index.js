import { combineReducers } from "redux";
import authReducer from "./auth/authReducer";
import errorsReducer from "./errors/errorsReducers";

export default combineReducers({
  auth: authReducer,
  errors: errorsReducer
});
