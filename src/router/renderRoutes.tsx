import React from "react";
import { Switch, Route, SwitchProps, Redirect } from "react-router";
import { RouteConfig } from "react-router-config";
import checkMobile from "@/util/checkMobile";

export interface IRouteConfig extends RouteConfig {
  auth?: number;
  routes?: IRouteConfig[];
  multipleRoutes?: IRouteConfig[];
}

/**
 * 将路由配置渲染成节点
 * @param routes switch路由列表
 * @param authed 当前账号权限
 * @param multipleRoutes 非switch路由列表，将会在Switch节点前渲染Route
 * @param extraProps 添加额外的Route props
 * @param switchProps Switch props
 */
function renderRoutes(
  routes: IRouteConfig[] | undefined,
  authed: number,
  multipleRoutes?: IRouteConfig[],
  extraProps?: any,
  switchProps?: SwitchProps
) {
  const isMobile = checkMobile();
  let list = [];
  const mapFunc = (R: IRouteConfig[]) =>
    R.map((route, i) => (
      <Route
        key={route.key || i}
        path={route.path}
        exact={route.exact}
        strict={route.strict}
        render={props => {
          if (authed !== undefined) route.authed = authed;
          if (!route.auth || route.auth <= authed) {
            return route.render
              ? route.render({ ...props, ...extraProps, route: route })
              : route.component && (
                  <route.component {...props} {...extraProps} route={route} />
                );
          } else {
            return (
              <Redirect
                to={
                  route.auth <= 1 && isMobile
                    ? "/user/loginRegister/login"
                    : "/admin/login"
                }
              />
            );
          }
        }}
      />
    ));
  if (routes) {
    list.push(
      <Switch {...switchProps} key="biubiubiu~~">
        {mapFunc(routes)}
      </Switch>
    );
    multipleRoutes && list.unshift(...mapFunc(multipleRoutes));
    return list;
  }
}

export default renderRoutes;
