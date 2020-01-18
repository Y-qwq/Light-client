import React, { useCallback } from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Header from "@/components/Header";
import axios from "axios";
import "./index.scss";

const ChangeInfo = () => {
  const history = useHistory();
  
  const exit = useCallback(() => {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
    history.push("/user/loginRegister/login");
  }, [history]);

  return (
    <div className="user-setting">
      <Header title="设置" />
      <List className="user-setting-list">
        <ListItem button style={{ backgroundColor: "#fff" }} onClick={exit}>
          <ListItemText primary="退出登录" />
        </ListItem>
      </List>
    </div>
  );
};

export default ChangeInfo;
