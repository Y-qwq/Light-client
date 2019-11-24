import types from "./types";

export class loginAction {
  public static changeLoginStatus = (payload?: number) => {
    return {
      type: types.CHANGE_LOGIN_STATUS,
      payload
    };
  };
  public static setUserInfo = (payload?: object) => {
    return {
      type: types.SET_USER_INFO,
      payload
    };
  };
}
