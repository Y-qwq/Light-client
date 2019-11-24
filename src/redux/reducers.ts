import types from "./types";

interface IAction {
  type: string;
  payload: any;
}

export interface IUserInfo {
  auth: number;
  collections: string[];
  email: string;
  lastLoginIp: string;
  upToken?: string;
  username: string;
  avatar?: string;
  introduction?: string;
}

export interface IUser {
  loginStatus: number;
  info: IUserInfo;
}

const userInitialState: IUser = {
  // -1:初始化未知能否登录  0：未登录 1-9：已登录，数字代表权限
  loginStatus: -1,
  info: {
    email: "",
    username: "",
    auth: 0,
    collections: [],
    lastLoginIp: "",
    upToken: "",
    avatar: "",
    introduction: ""
  }
};

export function user(state: IUser = userInitialState, action: IAction) {
  switch (action.type) {
    case types.CHANGE_LOGIN_STATUS:
      return {
        ...state,
        loginStatus: action.payload
      };

    case types.SET_USER_INFO:
      return {
        ...state,
        info: action.payload
      };

    default:
      return state;
  }
}
