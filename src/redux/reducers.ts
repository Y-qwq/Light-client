import types from "./types";

interface IAction {
  type: string;
  payload: any;
}

export interface IUser {
  isLogged: boolean;
}

const userInitialState: IUser = {
  isLogged: false
};

export function user(state: IUser = userInitialState, action: IAction) {
  switch (action.type) {
    case types.CHANGE_LOGIN:
      let res = {
        ...state,
        isLogged: !state.isLogged
      };
      if (action.payload !== undefined) res.isLogged = action.payload;
      return res;

    default:
      return state;
  }
}
