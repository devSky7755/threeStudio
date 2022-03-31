// action - state management
import * as actionTypes from "./actions";
import { v4 as uuid } from "uuid";

export interface ModelControl {
  show_model?: boolean | null;
  show_skt?: boolean | null;
  activate_all?: boolean | null;
  continue_model?: boolean | null;
}

export interface Model {
  uuid: string | null;
  file_name: string | null;
  type: string | null;
  position: any | null;
  color: string | null;
  useJSX?: boolean | null;
  animation?: boolean | null;
  control?: ModelControl | null;
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
          color: null,
          useJSX: action.payload?.useJSX || false,
          control: null,
        };
        const models = [...state.models, newModel];
        const selModel = newModel.uuid;
        return {
          ...state,
          models,
          selModel,
        };
      } else return state;

    case actionTypes.SELECT_MODEL:
      if (action.payload?.selected) {
        const selModel = action.payload?.selected;
        return {
          ...state,
          selModel,
        };
      } else return state;

    case actionTypes.DESELECT_MODEL:
      return {
        ...state,
        selModel: null,
      };

    case actionTypes.SET_MODEL_COLOR:
      if (!state.selModel) return state;
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

    case actionTypes.UPDATE_MODEL:
      const nModels = state.models.map((model) => {
        if (model.uuid === action.payload?.model?.uuid) {
          return { ...action.payload?.model };
        }
        return model;
      });
      return {
        ...state,
        models: nModels,
      };

    case actionTypes.DELETE_SEL_MODEL:
      const dModels = state.models.filter((model) => {
        return model.uuid !== state.selModel;
      });
      return {
        ...state,
        selModel: null,
        models: dModels,
      };

    default:
      return state;
  }
};

export default modelReducer;
