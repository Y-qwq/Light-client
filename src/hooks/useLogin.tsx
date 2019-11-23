import { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { userLogin, adminLogin } from "@/api";

interface IUseLogin {
  (type: "admin" | "user"): [
    "fail" | "loading" | "success",
    number,
    (account: string, password: string) => Promise<void>
  ];
}

const useLogin: IUseLogin = (type: "admin" | "user") => {
  const [loginStatus, setLoginStatus] = useState<
    "fail" | "loading" | "success"
  >("fail");
  const [auth, setAuth] = useState(0);

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
      setAuth(+data.user.auth);
      setLoginStatus("success");
      axios.defaults.headers.common["Authorization"] = data.user.token;
      localStorage.setItem(isAdmin ? "adminToken" : "token", data.user.token);
    } else {
      setLoginStatus("fail");
    }
  };

  return [loginStatus, auth, setFetchLogin];
};

export default useLogin;
