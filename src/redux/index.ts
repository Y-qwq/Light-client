import { combineReducers } from "redux";
import { user, data } from "./reducers";

const reducers = combineReducers({
  user,
  data
});

export default reducers;
