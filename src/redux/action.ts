import types from "./types";

export class loginAction {
  public static changeLogin = (payload?: boolean) => {
    return {
      type: types.CHANGE_LOGIN,
      payload
    };
  };
}
