// action - state management
import { GLTF as MOCK_GLTF } from "../provider/mock";
import * as actionTypes from "./actions";

export const initialState = {
  file_name: null,
  type: null,
  position: null,
};

// ==============================|| MODEL REDUCER ||============================== //

const modelReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.ADD_MODEL:
      return {
        ...state,
        file_name: action.payload?.file_name,
        type: action.payload?.type,
        position: action.payload?.position,
      };
    default:
      return state;
  }
};

export default modelReducer;
