import types from "./types";

interface IAction {
  type: string;
  payload: any;
}

const userInitialState = {
  isLogged: false
};

export function user(state = userInitialState, action: IAction) {
  switch (action.type) {
    case types.TEST:
      console.log("TEST SUCCESS!");
      return { isLogged: true };

    default:
      return state;
  }
}
