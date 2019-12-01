import types from "./types";

interface IAction {
  type: string;
  payload: any;
}

export interface IUserInfo {
  _id: string;
  auth: number;
  collections: string[];
  email: string;
  lastLoginIp: string;
  qiniu?: { server: string; token: string };
  username: string;
  avatar?: string;
  introduction?: string;
}

export interface IUser {
  loginStatus: number;
  info: IUserInfo;
}

export interface IState {
  user: IUser;
}

const userInitialState: IUser = {
  // -1:初始化未知能否登录  0：未登录 1-9：已登录，数字代表权限
  loginStatus: -1,
  info: {
    _id: "",
    email: "",
    username: "",
    auth: 0,
    collections: [],
    lastLoginIp: "",
    qiniu: { server: "", token: "" },
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
