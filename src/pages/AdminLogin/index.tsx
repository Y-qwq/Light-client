import React from "react";
import { useLocation } from "react-router";
import { RouteConfigComponentProps, renderRoutes } from "react-router-config";
import "./index.scss";

const AdminLogin = ({ route }: RouteConfigComponentProps) => {
  const location = useLocation();
  return (
    <div className="admin-login">
      <div className="admin-login-box">
        <p className="admin-login-box-logo">Light</p>
        {location.pathname === "/admin/login" && (
          <p className="admin-login-box-prompt">登录控制中心</p>
        )}
        {route && renderRoutes(route.routes)}
      </div>
    </div>
  );
};

export default AdminLogin;
