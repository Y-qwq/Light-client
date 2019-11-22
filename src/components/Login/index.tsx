import React, { useState, useCallback, useEffect } from "react";
import MyInput from "@/commom/MyInput";
import LongButton from "@/commom/LongButton";
import { useHistory } from "react-router";
import useLogin from "@/hooks/useLogin";
import "./index.scss";

const Login: React.SFC = () => {
  const history = useHistory();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setFetchLogin] = useLogin("user");

  const handleLogin = useCallback(async () => {
    setFetchLogin(account, password);
  }, [account, password, setFetchLogin]);

  // 登录失败，清除密码。
  useEffect(() => {
    loginStatus === "fail" && setPassword("");
  }, [loginStatus]);

  return (
    <div className="login-content">
      <MyInput
        name="账号"
        placeholder="请输入邮箱"
        className="login-account"
        value={account}
        onChange={e => setAccount(e.target.value)}
      />
      <MyInput
        name="密码"
        placeholder="请输入密码"
        type="password"
        className="login-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <LongButton
        text="登录"
        action={
          password &&
          loginStatus === "fail" &&
          /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(
            account
          )
        }
        onClick={handleLogin}
      />
      <div className="login-text-box">
        <p onClick={() => history.push("/user/loginRegister/register")}>注册</p>
        <p onClick={() => history.push("/user/loginRegister/forget")}>
          忘记密码
        </p>
      </div>
    </div>
  );
};

export default Login;
