import React, { useState, useCallback, useEffect, useMemo } from "react";
import { RouteConfigComponentProps } from "react-router-config";
import LongButton from "@/common/LongButton";
import { useHistory } from "react-router";
import useLogin from "@/hooks/useLogin";
import MyInput from "@/common/MyInput";
import "./index.scss";
import { useDispatch } from "react-redux";
import { loginAction } from "@/redux/action";

interface ILoginComp {
  type?: "user" | "admin";
}

interface ILoginRouteComp extends RouteConfigComponentProps {
  type?: "user" | "admin";
}

const Login = ({ type = "user" }: ILoginComp | ILoginRouteComp) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, user, setFetchLogin] = useLogin(type);

  const handleLogin = useCallback(async () => {
    setFetchLogin(account, password);
  }, [account, password, setFetchLogin]);

  // 登录回调处理
  useEffect(() => {
    loginStatus === "fail" && setPassword("");
    if (loginStatus === "success" && user) {
      dispatch(loginAction.changeLoginStatus(user.auth));
      dispatch(loginAction.setUserInfo(user));
      if (type === "user") {
        history.push("/user/me");
      } else {
        history.push(
          user.auth >= 3
            ? "/admin/consolePanel"
            : "/admin/consolePanel/article/list/read"
        );
      }
    }
  }, [loginStatus, history, type, dispatch, user]);

  // 当前状态是否可登录
  const action = useMemo(
    () =>
      password &&
      loginStatus === "fail" &&
      /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(account),
    [account, password, loginStatus]
  );

  const register = useCallback(
    () => history.push("/user/loginRegister/register"),
    [history]
  );

  const forget = useCallback(
    () =>
      history.push(
        type === "user" ? "/user/loginRegister/forget" : "/admin/login/forget"
      ),
    [history, type]
  );

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
        onKeyDown={e => e.keyCode === 13 && action && handleLogin()}
      />
      <LongButton text="登录" action={action} onClick={handleLogin} />
      <div className="login-text-box">
        <p className="login-text-box-text" onClick={register}>
          {type === "user" && "注册"}
        </p>
        <p className="login-text-box-text" onClick={forget}>
          忘记密码
        </p>
      </div>
    </div>
  );
};

export default Login;
