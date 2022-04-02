import { combineReducers } from "redux";

// reducer import
import modelReducer from "./modelReducer";
import controlReducer from "./controlReducer";

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  model: modelReducer,
  control: controlReducer,
});

export default reducer;
