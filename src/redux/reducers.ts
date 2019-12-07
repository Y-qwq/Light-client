import types from "./types";

export interface IState {
  user: IUser;
  data: IData;
}

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
  lastLoginAddress: string;
  qiniu?: { server: string; token: string };
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
    _id: "",
    email: "",
    username: "",
    auth: 0,
    collections: [],
    lastLoginIp: "",
    lastLoginAddress: "",
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

    case types.UPDATE_AVATAR_HSAH:
      return {
        ...state,
        info: {
          ...state.info,
          avatar: action.payload
        }
      };

    default:
      return state;
  }
}

export interface IDataUser {
  activation: number;
  avatar: string;
  banned: number;
  _id: string;
  username: string;
  email: string;
  auth: number;
  created: string;
  updated: string;
  lastLoginIp: string;
  lastLoginAddress: string;
  lastLoginDate: string;
  [propName: string]: any;
}

export interface IData {
  userList: IDataUser[];
}

const dataInitialState = {
  userList: []
};

export function data(state: IData = dataInitialState, action: IAction) {
  switch (action.type) {
    case types.SET_USER_LIST:
      return {
        ...state,
        userList: action.payload
      };

    default:
      return state;
  }
}
