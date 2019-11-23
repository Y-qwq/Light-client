import types from "./types";

interface IAction {
  type: string;
  payload: any;
}

export interface IUser {
  loginStatus: number;
}

const userInitialState: IUser = {
  // -1:初始化未知能否登录  0：未登录 1-9：已登录，数字代表权限
  loginStatus: -1
};

export function user(state: IUser = userInitialState, action: IAction) {
  switch (action.type) {
    case types.CHANGE_LOGIN_STATUS:
      return {
        ...state,
        loginStatus: action.payload
      };

    default:
      return state;
  }
}
