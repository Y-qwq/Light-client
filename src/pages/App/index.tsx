import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { createStore, applyMiddleware } from "redux";
import { loginAction } from "@/redux/action";
import { Spin } from "antd";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import axios from "axios";
import reducers from "@/redux";
import { mobileRouterList, pcRouterList } from "@/router";
import Menu from "@/components/Menu";
import { checkToken } from "@/api";
import "@/assets/theme/_antdTheme.less";
import "@/assets/theme/_base.scss";
import "@/assets/font/font.css";
import "./index.scss";

const store =
  process.env.NODE_ENV === "production"
    ? createStore(reducers, applyMiddleware(thunk))
    : createStore(reducers, applyMiddleware(thunk, logger));

const Loading: React.FC = () => {
  return <Spin tip="Loading" className="loading" />;
};

const App: React.SFC = () => {
  const [isMobile, setIsMobile] = useState(false);

  // 判断是否为手机
  useEffect(() => {
    const ua = navigator.userAgent;
    const Agents = [
      "Android",
      "iPhone",
      "SymbianOS",
      "Windows Phone",
      "iPad",
      "iPod"
    ];
    for (var v = 0; v < Agents.length; v++) {
      if (ua.indexOf(Agents[v]) > 0) {
        setIsMobile(true);
        return;
      }
    }
  }, []);

  // 检测token有效期,并设置Authorization。
  useEffect(() => {
    const tokenName = isMobile ? "token" : "adminToken";
    const token = localStorage.getItem(tokenName);
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      const check = async () => {
        const res = await checkToken();
        res.status === 200 && store.dispatch(loginAction.changeLogin(true));
      };
      check();
    }
  }, [isMobile]);

  return (
    <Router>
      <Provider store={store}>
        <Suspense fallback={<Loading />}>
          {renderRoutes(isMobile ? mobileRouterList : pcRouterList)}
        </Suspense>
        {isMobile && <Menu />}
      </Provider>
    </Router>
  );
};

export default App;
