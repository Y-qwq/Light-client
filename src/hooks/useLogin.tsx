import { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { userLogin, adminLogin } from "@/api";
import { IUserInfo } from "@/redux/reducers";

interface IUseLogin {
  (type: "admin" | "user"): [
    "fail" | "loading" | "success",
    IUserInfo | undefined,
    (account: string, password: string) => Promise<void>
  ];
}

const useLogin: IUseLogin = (type: "admin" | "user") => {
  const [loginStatus, setLoginStatus] = useState<
    "fail" | "loading" | "success"
  >("fail");
  const [user, setUser] = useState(undefined);

  const setFetchLogin = async (account: string, password: string) => {
    const isAdmin = type === "admin";
    let data;
    setLoginStatus("loading");
    if (isAdmin) {
      data = (await adminLogin(account, password)).data;
    } else {
      data = (await userLogin(account, password)).data;
    }
    if (data && data.type === "success") {
      message.success(data.message);
      setUser(data.user);
      setLoginStatus("success");
      axios.defaults.headers.common["Authorization"] = data.user.token;
      localStorage.setItem(isAdmin ? "adminToken" : "token", data.user.token);
    } else {
      setLoginStatus("fail");
    }
  };

  return [loginStatus, user, setFetchLogin];
};

export default useLogin;
