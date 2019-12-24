import React, { useCallback } from "react";
import { RouteConfigComponentProps } from "react-router-config";
import UploadAvatar from "@/components/UploadAvatar";
import renderRoutes from "@/router/renderRoutes";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { IState } from "@/redux/reducers";
import { QINIU_CLIENT } from "@/api";
import MyIcon from "@/assets/MyIcon";
import "./index.scss";

const Me = ({ route }: RouteConfigComponentProps) => {
  const history = useHistory();
  const user = useSelector((state: IState) => state.user.info);

  const handleGoChange = useCallback(() => {
    history.push("/user/me/changeInfo");
  }, [history]);

  return (
    <div className="me">
      {route && renderRoutes(route.routes, route.authed)}
      <div
        className="me-header"
        style={{
          backgroundImage: `url(${QINIU_CLIENT}/light/bg-user-info.jpg)`
        }}
      >
        <MyIcon type="setting" className="me-header-setting" />
        <UploadAvatar _id={user._id} hash={user.avatar} />
        <p className="me-header-name" onClick={handleGoChange}>
          {user.username}
        </p>
        <p className="me-header-introduction" onClick={handleGoChange}>
          {user.introduction}
        </p>
      </div>
      <div className="me-collections">
        <p className="me-collections-title">我的收藏</p>
        <div className="me-collections-content">
          <MyIcon type="eye" className="me-collections-icons" />
          <MyIcon type="image" className="me-collections-icons" />
          <MyIcon type="music" className="me-collections-icons" />
          <MyIcon type="movie" className="me-collections-icons" />
          <MyIcon type="fm" className="me-collections-icons" />
        </div>
      </div>
    </div>
  );
};

export default Me;
