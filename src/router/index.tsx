import React, { lazy } from "react";
import { Redirect } from "react-router-dom";

import Login from "../components/Login";
import Forget from "../components/Forget";
import LoginOut from "../components/LoginOut";
import Register from "../components/Register";

// 用户(手机)路由配置
export const mobileRouterList = [
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

// PC端(管理员)路由配置
export const pcRouterList = [
  {
    path: "/",
    exact: true,
    render: () => <Redirect to="/admin/login" />
  },
  {
    path: "/consolePanel",
    exact: true,
    component: lazy(() => import("@/pages/ConsolePanel"))
  },
  {
    path: "/admin/login",
    component: lazy(() => import("@/pages/AdminLogin")),
    routes: [
      {
        path: "/admin/login",
        exact: true,
        render: () => <Login type={"admin"} />
      },
      {
        path: "/admin/login/forget",
        component: Forget
      }
    ]
  }
];
