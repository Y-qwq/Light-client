import React from "react";
import { Avatar } from "antd";
import { QINIU_CLIENT } from "@/api";
import { useSelector } from "react-redux";
import { IState } from "@/redux/reducers";
import MyIcon from "@/assets/MyIcon";
import "./index.scss";

const Me = () => {
  const user = useSelector((state: IState) => state.user.info);

  return (
    <div className="me">
      <div className="me-header">
        <MyIcon type="setting" className="me-header-setting" />
        <Avatar
          size={64}
          className="me-header-avatar"
          src={`${QINIU_CLIENT}/avatar/${user._id}?h=${user.avatar}`}
        />
        <p className="me-header-name">{user.username}</p>
        <p className="me-header-introduction">{user.introduction}</p>
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
