import React, { lazy } from "react";
import { Redirect } from "react-router-dom";

import Login from "../components/Login";
import Forget from "../components/Forget";
import LoginOut from "../components/LoginOut";
import Register from "../components/Register";

// 主路由配置
export const mainRouterList = [
  {
    path: "/",
    exact: true,
    render: () => <Redirect to="/user" />
  },
  {
    path: "/user/info",
    component: lazy(() => import("../pages/UserInfo"))
  },
  {
    path: "/user/loginRegister",
    component: lazy(() => import("../pages/LoginRegister")),
    routes: [
      {
        path: "/user/loginRegister/login",
        component: Login
      },
      {
        path: "/user/loginRegister/forget",
        component: Forget
      },
      {
        path: "/user/loginRegister/loginout",
        component: LoginOut
      },
      {
        path: "/user/loginRegister/register",
        component: Register
      }
    ]
  }
];
