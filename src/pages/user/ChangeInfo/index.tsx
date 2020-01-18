import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TextField } from "@material-ui/core";
import { loginAction } from "@/redux/action";
import { IState } from "@/redux/reducers";
import Header from "@/components/Header";
import { updateUserInfo } from "@/api";
import "./index.scss";

const ChangeInfo = () => {
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

  return (
    <div className="change-info">
      <Header title="修改信息" />

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
