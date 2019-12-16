import React, { useEffect, useState, useCallback } from "react";
import { RouteConfigComponentProps } from "react-router-config";
import { useLocation, useHistory } from "react-router-dom";
import renderRoutes from "@/router/renderRoutes";
import { useSelector } from "react-redux";
import { IState } from "@/redux/reducers";
import MyIcon from "@/assets/MyIcon";
import "./index.scss";

const UserMain = ({ route }: RouteConfigComponentProps) => {
  const location = useLocation();
  const history = useHistory();
  const { loginStatus } = useSelector((state: IState) => ({
    loginStatus: state.user.loginStatus
  }));
  const menuList = [
    { to: "/user/all", name: "ALL", icon: "all2" },
    { to: "/user/light", name: "LIGHT", icon: "light" },
    { to: "/user", name: "ME", icon: "me" }
  ];

  const [action, setAction] = useState(0);

  useEffect(() => {
    const pathname = location.pathname;
    if (/^\/user\/(me|loginRegister).*/.test(pathname)) {
      setAction(2);
    } else if (/^\/user\/light.*/.test(pathname)) {
      setAction(1);
    } else if (/^\/user\/all.*/.test(pathname)) {
      setAction(0);
    }
  }, [location.pathname]);

  const handleMenuClick = useCallback(
    (idx: number) => {
      setAction(idx);
      if (idx === 2) {
        if (loginStatus === 0) {
          history.push("/user/loginRegister/loginout");
        } else {
          history.push("/user/me");
        }
        return;
      }
      history.push(menuList[idx].to);
    },
    [history, menuList, loginStatus]
  );

  return (
    <>
      {route && renderRoutes(route.routes, route.authed)}
      <div className="menu">
        {menuList.map(({ icon, name }, idx) => (
          <div
            className="menu-box"
            key={idx}
            onClick={() => handleMenuClick(idx)}
          >
            <MyIcon
              type={icon + (idx === action ? "-action" : "")}
              className="menu-icon"
            />
            <p className="menu-name">{name}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserMain;
