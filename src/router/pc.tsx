import React, { lazy } from "react";
import { Redirect } from "react-router-dom";
import { IRouteConfig } from "./renderRoutes";

import LoginComp from "@/components/Login";
import Login from "@/pages/admin/Login";
import Forget from "@/components/Forget";
import ChangeInfo from "@/pages/admin/ChangeInfo";
import ConsolePanel from "@/pages/admin/ConsolePanel";
import Home from "@/pages/admin/Home";
import TotalUserManage from "@/pages/admin/TotalUserManage";
import ArticleList from "@/pages/admin/ArticleList";
import SystemManage from "@/pages/admin/SystemManage";

// PC端(管理员)路由配置
const pcRouterList: IRouteConfig[] = [
  {
    path: "/",
    exact: true,
    render: () => <Redirect to="/admin/consolePanel" />
  },
  {
    path: "/admin/changeInfo",
    auth: 2,
    component: ChangeInfo
  },
  {
    path: "/admin/consolePanel",
    auth: 2,
    component: ConsolePanel,
    routes: [
      {
        path: "/admin/consolePanel",
        exact: true,
        auth: 3,
        component: Home
      },
      {
        path: "/admin/consolePanel/userManage",
        auth: 3,
        component: TotalUserManage
      },
      {
        path: "/admin/consolePanel/article/list/:type",
        component: ArticleList,
        routes: [
          {
            path: "/admin/consolePanel/article/list/:type/:id",
            component: ArticleList
          }
        ]
      },
      {
        path: "/admin/consolePanel/article/release/:type",
        component: lazy(() => import("@/pages/admin/ReleaseArticle"))
      },
      {
        path: "/admin/consolePanel/SystemManage",
        component: SystemManage
      }
    ]
  },
  {
    path: "/admin/login",
    component: Login,
    routes: [
      {
        path: "/admin/login",
        exact: true,
        render: () => <LoginComp type={"admin"} />
      },
      {
        path: "/admin/login/forget",
        component: Forget
      }
    ]
  }
];

export default pcRouterList;
