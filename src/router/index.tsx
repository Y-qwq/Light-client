import React, { lazy } from "react";
import { Redirect } from "react-router-dom";

// 主路由配置
export const mainRouterList = [
  {
    path: "/",
    exact: true,
    render: () => <Redirect to="/login" />
  },
  {
    path: "/login",
    component: lazy(() => import("../pages/Test"))
  }
];
