import React, { useMemo } from "react";
import { renderRoutes, RouteConfigComponentProps } from "react-router-config";
import bgImg from "@/assets/images/bg-login.jpg";
import "./index.scss";

const LoginRegister = ({ location, route }: RouteConfigComponentProps) => {
  const head = useMemo(
    () => (
      <>
        <div className="login-register-bg-box">
          <img src={bgImg} className="login-register-bg" alt="logo" />
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
        {route && renderRoutes(route.routes)}
      </div>
    </div>
  );
};

export default LoginRegister;
