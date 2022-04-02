// action - state management
import * as actionTypes from "./actions";

export const initialState: {
  action: {
    start: string | null;
    end: string | null;
  } | null;
  duration: number | null;
} = {
  action: null,
  duration: null,
};

// ==============================|| CONTROL REDUCER ||============================== //

const controlReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.COMMIT_CONTROL_ACTION:
      if (action.payload?.action) {
        return {
          ...state,
          action: action.payload?.action,
          duration: action.payload?.duration || 1.5,
        };
      } else return state;
    case actionTypes.CLEAR_CONTROL_ACTION:
      return {
        action: null,
        duration: null,
      };
    default:
      return state;
  }
};

export default controlReducer;
