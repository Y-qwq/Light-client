import React, { Suspense, useEffect, useCallback } from "react";
import Loading from "@/commom/Loading";
import { mobileRouterList, pcRouterList } from "@/router";
import { useDispatch, useSelector } from "react-redux";
import { checkToken, checkAdminToken, musicLogin } from "@/api";
import renderRoutes from "@/router/renderRoutes";
import { useLocation } from "react-router-dom";
import { loginAction } from "@/redux/action";
import checkMobile from "@/util/checkMobile";
import { IState } from "@/redux/reducers";
import Menu from "@/components/Menu";
import axios from "axios";
import "@/assets/theme/_antdTheme.less";
import "@/assets/theme/_base.scss";
import "@/assets/font/font.css";
import "./index.scss";
import { message } from "antd";

const isMobile = checkMobile();

const App: React.SFC = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const loginStatus = useSelector((state: IState) => state.user.loginStatus);

  const neteaseCloudMusicLogin = useCallback(
    async (account: string, password: string) => {
      try {
        const res = await musicLogin(account, password);
        if (res.status === 200 && res.data.code === 200) {
          console.log("云音乐自动登录成功！");
        }
      } catch (error) {
        message.error("云音乐账户或密码错误，自动登录失败！");
      }
    },
    []
  );

  const checkTokenAndLogin = useCallback(async () => {
    const { data } = isMobile ? await checkToken() : await checkAdminToken();
    if (data && data.type === "success") {
      const user = data.user;
      dispatch(loginAction.changeLoginStatus(+user.auth));
      dispatch(loginAction.setUserInfo(user));
      user.music_account &&
        user.music_password &&
        neteaseCloudMusicLogin(user.music_account, user.music_password);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      dispatch(loginAction.changeLoginStatus(0));
    }
  }, [dispatch, neteaseCloudMusicLogin]);

  // 检测token有效期,自动登录,并设置Authorization。
  useEffect(() => {
    const tokenName = isMobile ? "token" : "adminToken";
    const token = localStorage.getItem(tokenName);
    // 如果用户直接输入登录界面URL，则不做自动登录处理
    if (token && !/login/g.test(pathname)) {
      axios.defaults.headers.common["Authorization"] = token;
      checkTokenAndLogin();
    } else {
      dispatch(loginAction.changeLoginStatus(0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, checkTokenAndLogin]);

  return (
    <>
      {loginStatus !== -1 ? (
        <Suspense fallback={<Loading />}>
          {renderRoutes(
            isMobile ? mobileRouterList : pcRouterList,
            loginStatus
          )}
        </Suspense>
      ) : (
        <Loading />
      )}
      {isMobile && <Menu />}
    </>
  );
};

export default App;
