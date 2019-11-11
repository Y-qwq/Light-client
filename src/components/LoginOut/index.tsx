import React from "react";
import "./index.scss";
import { useHistory } from "react-router";

const LoginOut: React.SFC = () => {
  const history = useHistory();
  return (
    <div className="login-out">
      <p className="login-out-logo">Light</p>
      <button
        className="login-out-button"
        onClick={() => history.push("/user/loginRegister/login")}
      >
        登录
      </button>
    </div>
  );
};

export default LoginOut;
