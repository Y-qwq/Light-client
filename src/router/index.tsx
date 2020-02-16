import React, { lazy } from "react";
import { Redirect } from "react-router-dom";
import { IRouteConfig } from "./renderRoutes";

import Main from "@/pages/user/Main";

import Login from "@/components/Login";
import Forget from "@/components/Forget";
import LoginOut from "@/components/LoginOut";
import Register from "@/components/Register";

const Article = lazy(() => import("@/pages/user/Article"));

// 用户(手机)路由配置
export const mobileRouterList: IRouteConfig[] = [
  {
    path: "/",
    exact: true,
    render: () => <Redirect to="/user/all" />
  },
  {
    path: "/user",
    component: Main,
    multipleRoutes: [
      { path: "/user/:page/article/:id", component: Article },
      { path: "/user/:page/:childPage/article/:id", component: Article }
    ],
    routes: [
      {
        path: "/user/category/:type",
        component: lazy(() => import("@/pages/user/ArticleCategory"))
      },
      {
        path: "/user/all",
        component: lazy(() => import("@/pages/user/All"))
      },
      {
        path: "/user/light",
        auth: 1,
        component: lazy(() => import("@/pages/user/Light"))
      },
      {
        path: "/user/me",
        auth: 1,
        component: lazy(() => import("@/pages/user/Me")),
        routes: [
          {
            path: "/user/me/changeInfo",
            component: lazy(() => import("@/pages/user/ChangeInfo"))
          },
          {
            path: "/user/me/setting",
            component: lazy(() => import("@/pages/user/Setting"))
          }
        ]
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
    ]
  }
];

// PC端(管理员)路由配置
export const pcRouterList: IRouteConfig[] = [
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
        auth: 3,
        component: lazy(() => import("@/pages/admin/Home"))
      },
      {
        path: "/admin/consolePanel/userManage",
        auth: 3,
        component: lazy(() => import("@/pages/admin/TotalUserManage"))
      },
      {
        path: "/admin/consolePanel/article/list/:type",
        component: lazy(() => import("@/pages/admin/ArticleList")),
        routes: [
          {
            path: "/admin/consolePanel/article/list/:type/:id",
            component: lazy(() => import("@/pages/admin/Article"))
          }
        ]
      },
      {
        path: "/admin/consolePanel/article/release/:type",
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
