// action - state management
import { GLTF as MOCK_GLTF } from "../provider/mock";
import * as actionTypes from "./actions";

export const initialState = {
  file_name: MOCK_GLTF.file_names[3],
  type: "gltf",
};

// ==============================|| MODEL REDUCER ||============================== //

const modelReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.SET_MODEL:
      return {
        ...state,
        file_name: action.payload?.file_name,
        type: action.payload?.type,
      };
    default:
      return state;
  }
};

export default modelReducer;
