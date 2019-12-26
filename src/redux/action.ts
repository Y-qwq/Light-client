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
  public static updateAvatarHash = (payload?: string) => {
    return {
      type: types.UPDATE_AVATAR_HSAH,
      payload
    };
  };
  public static updateUserFollows = (payload: string[]) => {
    return {
      type: types.UPDATE_USER_FOLLOWS,
      payload
    };
  };
}

export class adminAction {
  public static setUserList = (payload: {}[]) => {
    return {
      type: types.SET_USER_LIST,
      payload
    };
  };
}
