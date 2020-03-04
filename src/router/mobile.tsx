import React from "react";
import { Redirect } from "react-router-dom";
import { IRouteConfig } from "./renderRoutes";

import Main from "@/pages/user/Main";
import Login from "@/components/Login";
import Forget from "@/components/Forget";
import LoginOut from "@/components/LoginOut";
import Register from "@/components/Register";
import Article from "@/pages/user/Article";
import ArticleCategory from "@/pages/user/ArticleCategory";
import All from "@/pages/user/All";
import Light from "@/pages/user/Light";
import Me from "@/pages/user/Me";
import LoginRegister from "@/pages/user/LoginRegister";
import Setting from "@/pages/user/Setting";
import ChangeInfo from "@/pages/user/ChangeInfo";

// 用户(手机)路由配置
const mobileRouterList: IRouteConfig[] = [
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
        component: ArticleCategory
      },
      {
        path: "/user/all",
        component: All
      },
      {
        path: "/user/light",
        auth: 1,
        component: Light
      },
      {
        path: "/user/me",
        auth: 1,
        component: Me,
        routes: [
          {
            path: "/user/me/changeInfo",
            component: ChangeInfo
          },
          {
            path: "/user/me/setting",
            component: Setting
          }
        ]
      },
      {
        path: "/user/loginRegister",
        component: LoginRegister,
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

export default mobileRouterList;
