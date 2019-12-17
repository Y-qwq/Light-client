import React, { useCallback, useState } from "react";
import { useHistory } from "react-router";
import { IState } from "@/redux/reducers";
import { useSelector, useDispatch } from "react-redux";
import { loginAction } from "@/redux/action";
import { updateUserInfo } from "@/api";
import { Icon } from "antd";
import {
  TextField,
  AppBar,
  Typography,
  Toolbar,
  IconButton
} from "@material-ui/core";
import "./index.scss";

const ChangeInfo = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state: IState) => state.user.info);
  const [username, setUserName] = React.useState(user.username);
  const [introduction, setIntroduction] = useState(user.introduction || "");

  const handleUpdateUserInfo = useCallback(async () => {
    const res = await updateUserInfo({
      email: user.email,
      username,
      introduction
    });
    if (res.data.type === "success") {
      dispatch(loginAction.setUserInfo({ username, introduction }));
    }
  }, [username, introduction, dispatch, user.email]);

  const goBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <div className="change-info">
      <AppBar className="change-info-bar">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={goBack}>
            <Icon type="left" />
          </IconButton>
          <Typography>修改信息</Typography>
        </Toolbar>
      </AppBar>

      <form className="change-info-form" noValidate autoComplete="off">
        <div>
          <TextField
            label="用户名"
            value={username}
            onBlur={handleUpdateUserInfo}
            onChange={e => setUserName(e.target.value)}
          />
          <TextField
            label="简介"
            value={introduction}
            onBlur={handleUpdateUserInfo}
            onChange={e => setIntroduction(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};

export default ChangeInfo;
