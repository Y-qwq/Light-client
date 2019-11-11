import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import MyIcon from "@/assets/MyIcon";
import { useSelector } from "react-redux";
import { IUser } from "@/redux/reducers";
import "./index.scss";

const Menu: React.SFC = () => {
  const location = useLocation();
  const history = useHistory();
  const { isLogged } = useSelector((state: { user: IUser }) => ({
    isLogged: state.user.isLogged
  }));
  const menuList = [
    { to: "/", name: "ALL", icon: "all2" },
    { to: "/", name: "LIGHT", icon: "light" },
    { to: "/user", name: "ME", icon: "me" }
  ];

  const [action, setAction] = useState(0);

  useEffect(() => {
    const pathname = location.pathname;
    if (/^\/user.*/.test(pathname)) {
      setAction(2);
    } else if (/^\/light.*/.test(pathname)) {
      setAction(1);
    } else {
      setAction(0);
    }
  }, [location.pathname]);

  const handleMenuClick = useCallback(
    (idx: number) => {
      setAction(idx);
      if (idx === 2) {
        if (!isLogged) {
          history.push("/user/loginRegister/loginout");
        } else {
          history.push("/user/info");
        }
        return;
      }
      history.push(menuList[idx].to);
    },
    [history, menuList, isLogged]
  );

  return (
    <div className="menu">
      {menuList.map(({ icon, name }, idx) => (
        <div className="menu-box" key={idx} onClick={() => handleMenuClick(idx)}>
          <MyIcon type={icon + (idx === action ? "-action" : "")} className="menu-icon" />
          <p className="menu-name">{name}</p>
        </div>
      ))}
    </div>
  );
};

export default Menu;
