import React from "react";
import { Switch, Route, SwitchProps, Redirect } from "react-router";
import { RouteConfig } from "react-router-config";
import checkMobile from "@/util/checkMobile";
import { message } from "antd";

function renderRoutes(
  routes: RouteConfig[] | undefined,
  authed: number,
  extraProps?: any,
  switchProps?: SwitchProps | undefined
) {
  const isMobile = checkMobile();
  return routes ? (
    <Switch {...switchProps}>
      {routes.map((route, i) => (
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
              message.warn("请先登录！");
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
      ))}
    </Switch>
  ) : null;
}

export default renderRoutes;
