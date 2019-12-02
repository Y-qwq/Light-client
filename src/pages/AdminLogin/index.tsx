import React from "react";
import { useLocation } from "react-router";
import renderRoutes from "@/router/renderRoutes";
import { RouteConfigComponentProps } from "react-router-config";
import { QINIU_CLIENT } from "@/api";
import "./index.scss";

const AdminLogin = ({ route }: RouteConfigComponentProps) => {
  const location = useLocation();
  return (
    <div
      className="admin-login"
      style={{
        backgroundImage: `url(${QINIU_CLIENT}/light/bg-admin-login.jpg)`
      }}
    >
      <div className="admin-login-box">
        <p className="admin-login-box-logo">Light</p>
        {location.pathname === "/admin/login" && (
          <p className="admin-login-box-prompt">登录控制中心</p>
        )}
        {route && renderRoutes(route.routes, route.authed)}
      </div>
    </div>
  );
};

export default AdminLogin;
