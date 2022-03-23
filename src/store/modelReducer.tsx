// action - state management
import { GLTF as MOCK_GLTF } from "../provider/mock";
import * as actionTypes from "./actions";
import { v4 as uuid } from "uuid";

export interface Model {
  uuid: string | null;
  file_name: string | null;
  type: string | null;
  position: any | null;
  color: string;
}

export const initialState: {
  selModel: string | null;
  models: Model[];
} = {
  selModel: null,
  models: [],
};

// ==============================|| MODEL REDUCER ||============================== //

const modelReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.ADD_MODEL:
      if (action.payload?.position && action.payload?.file_name) {
        const newModel = {
          uuid: uuid(),
          file_name: action.payload?.file_name,
          type: action.payload?.type,
          position: action.payload?.position,
          color: "#ffffff",
        };
        const models = [...state.models, newModel];
        const selModel = newModel.uuid;
        return {
          ...state,
          models,
          selModel,
        };
      } else return state;
    case actionTypes.SET_MODEL_COLOR:
      if (!state.selModel) return;
      const models = state.models.map((model) => {
        if (model.uuid === state.selModel) {
          model.color = action.payload?.color;
        }
        return model;
      });
      return {
        ...state,
        models,
      };
    default:
      return state;
  }
};

export default modelReducer;
