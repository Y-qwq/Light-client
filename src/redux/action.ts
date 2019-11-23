import types from "./types";

export class loginAction {
  public static changeLoginStatus = (payload?: number) => {
    return {
      type: types.CHANGE_LOGIN_STATUS,
      payload
    };
  };
}
