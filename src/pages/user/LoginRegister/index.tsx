import React, { useMemo } from "react";
import { RouteConfigComponentProps } from "react-router-config";
import renderRoutes from "@/router/renderRoutes";
import { QINIU_CLIENT } from "@/api";
import "./index.scss";

const LoginRegister = ({ location, route }: RouteConfigComponentProps) => {
  const head = useMemo(
    () => (
      <>
        <div className="login-register-bg-box">
          <img
            src={`${QINIU_CLIENT}/light/bg-login.jpg`}
            className="login-register-bg"
            alt="logo"
            draggable={false}
            onClick={() => false}
          />
        </div>
        <p className="login-register-logo">Light</p>
      </>
    ),
    []
  );

  return (
    <div className="login-register">
      {location && location.pathname !== "/user/loginRegister/loginout" && head}
      <div className="login-register-content">
        {route && renderRoutes(route.routes, route.authed)}
      </div>
    </div>
  );
};

export default LoginRegister;
