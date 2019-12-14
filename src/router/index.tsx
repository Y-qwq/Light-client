import React, { lazy } from "react";
import { Redirect } from "react-router-dom";

import Login from "@/components/Login";
import Forget from "@/components/Forget";
import LoginOut from "@/components/LoginOut";
import Register from "@/components/Register";

// 用户(手机)路由配置
export const mobileRouterList = [
  {
    path: "/",
    exact: true,
    render: () => <Redirect to="/user/all" />
  },
  {
    path: "/user/all",
    auth: 1,
    component: lazy(() => import("@/pages/user/UserAll"))
  },
  {
    path: "/user/light",
    auth: 1,
    component: lazy(() => import("@/pages/user/Light"))
  },
  {
    path: "/user/info",
    auth: 1,
    component: lazy(() => import("@/pages/user/UserInfo"))
  },
  {
    path: "/user/loginRegister",
    component: lazy(() => import("@/pages/user/LoginRegister")),
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
    render: () => <Redirect to="/admin/consolePanel" />
  },
  {
    path: "/admin/changeInfo",
    auth: 2,
    component: lazy(() => import("@/pages/admin/ChangeInfo"))
  },
  {
    path: "/admin/consolePanel",
    auth: 2,
    component: lazy(() => import("@/pages/admin/ConsolePanel")),
    routes: [
      {
        path: "/admin/consolePanel",
        exact: true,
        component: lazy(() => import("@/pages/admin/Home"))
      },
      {
        path: "/admin/consolePanel/userManage",
        component: lazy(() => import("@/pages/admin/TotalUserManage"))
      },
      {
        path: "/admin/consolePanel/list/",
        component: lazy(() => import("@/pages/admin/ArticleList"))
      },
      {
        path: "/admin/consolePanel/release/",
        component: lazy(() => import("@/pages/admin/ReleaseArticle"))
      },
      {
        path: "/admin/consolePanel/SystemManage",
        component: lazy(() => import("@/pages/admin/SystemManage"))
      }
    ]
  },
  {
    path: "/admin/login",
    component: lazy(() => import("@/pages/admin/Login")),
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
