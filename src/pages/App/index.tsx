import React, { Suspense, useEffect, useState, useCallback } from "react";
import FullScreenLoading from "@/commom/FullScreenLoading";
import { useLocation, useHistory } from "react-router-dom";
import { mobileRouterList, pcRouterList } from "@/router";
import { useDispatch, useSelector } from "react-redux";
import { checkToken, checkAdminToken } from "@/api";
import useCheckMobile from "@/hooks/useCheckMobile";
import { renderRoutes } from "react-router-config";
import { loginAction } from "@/redux/action";
import { IUser } from "@/redux/reducers";
import Menu from "@/components/Menu";
import { message } from "antd";
import axios from "axios";
import "@/assets/theme/_antdTheme.less";
import "@/assets/theme/_base.scss";
import "@/assets/font/font.css";
import "./index.scss";

const App: React.SFC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isMobile = useCheckMobile();
  const [targetUrl, setTargetUrl] = useState("");
  const loginStatus = useSelector(
    (state: { user: IUser }) => state.user.loginStatus
  );

  const checkTokenAndLogin = useCallback(async () => {
    const { data } = isMobile ? await checkToken() : await checkAdminToken();
    if (data && data.type === "success") {
      const auth = +data.auth && 1;
      dispatch(loginAction.changeLoginStatus(auth));
      // 内部获取目标URL，防止添加依赖导致多次执行
      let targetUrl;
      setTargetUrl(state => {
        targetUrl = state;
        return "";
      });
      // 有目标URL跳转目标URL，没有跳转对应主页
      targetUrl
        ? history.replace(targetUrl)
        : history.push(auth <= 2 ? "/consolePanel" : "/user/all");
    } else {
      delete axios.defaults.headers.common["Authorization"];
      dispatch(loginAction.changeLoginStatus(0));
    }
  }, [history, isMobile, dispatch]);

  // 检测token有效期,自动登录,并设置Authorization。
  useEffect(() => {
    const tokenName = isMobile ? "token" : "adminToken";
    const token = localStorage.getItem(tokenName);
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      checkTokenAndLogin();
    } else {
      dispatch(loginAction.changeLoginStatus(0));
    }
  }, [isMobile, dispatch, checkTokenAndLogin]);

  // 权限路由
  useEffect(() => {
    // 想直接进入某页面时，显示loading界面，等待token检查完再跳转鉴权
    if (loginStatus === -1 && !targetUrl && pathname !== "/") {
      setTargetUrl(pathname);
      history.replace("/loading");
      // 未登录 权限路由
    } else if (loginStatus === 0) {
      if (!/((^\/$)|login)/g.test(pathname)) {
        message.warn("请您先登录！");
        history.push(
          isMobile ? "/user/loginRegister/loginout" : "/admin/login"
        );
      }
      // 用户 权限路由
    } else if (loginStatus === 3) {
      if (/admin/g.test(pathname)) {
        message.warn("未登录或者你的账户权限不足，请以管理员账户登录！");
        history.push(isMobile ? "/" : "/admin/login");
      }
    }
  }, [pathname, history, isMobile, loginStatus, targetUrl]);

  return (
    <>
      <Suspense fallback={<FullScreenLoading />}>
        {loginStatus !== -1 &&
          renderRoutes(isMobile ? mobileRouterList : pcRouterList)}
      </Suspense>
      {isMobile && <Menu />}
    </>
  );
};

export default App;
