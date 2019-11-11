import React, { Suspense, useEffect } from "react";
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
import { mainRouterList } from "@/router";
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
  // 检测token有效期。
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      const check = async () => {
        const res = await checkToken();
        res.status === 200 && store.dispatch(loginAction.changeLogin(true));
      };
      check();
    }
  }, []);

  return (
    <Router>
      <Provider store={store}>
        <Suspense fallback={<Loading />}>{renderRoutes(mainRouterList)}</Suspense>
        <Menu />
      </Provider>
    </Router>
  );
};

export default App;
