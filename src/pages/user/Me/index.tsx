import React, { useCallback, useEffect, useState } from "react";
import { RouteConfigComponentProps } from "react-router-config";
import { QINIU_CLIENT, getCollectioins } from "@/api";
import UploadAvatar from "@/components/UploadAvatar";
import renderRoutes from "@/router/renderRoutes";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { IState } from "@/redux/reducers";
import MyIcon from "@/assets/MyIcon";
import { IListData } from "../Light";
import { Empty } from "antd";
import "./index.scss";

const Me = ({ route }: RouteConfigComponentProps) => {
  const history = useHistory();
  const user = useSelector((state: IState) => state.user.info);
  const [curType, setCurType] = useState("ALL");
  const [collections, setCollections] = useState<IListData[]>([]);
  const [curTypeList, setCurTypeList] = useState<IListData[]>([]);

  useEffect(() => {
    if (user.collections.length) {
      (async () => {
        const res = await getCollectioins(user.collections);
        if (res.data.type === "success") {
          setCollections(res.data.list);
          setCurTypeList(res.data.list);
        }
      })();
    }
  }, [user.collections]);

  useEffect(() => {
    if (curType === "ALL") {
      setCurTypeList(collections);
      return;
    }
    const type = curType.toLowerCase();
    setCurTypeList(collections.filter(item => item.type === type));
  }, [curType, collections]);

  const handlePushHistory = useCallback(
    (suffix: string) => {
      history.push("/user/me/" + suffix);
    },
    [history]
  );

  const handleChangeType = useCallback((type: string) => {
    setCurType(preState => (preState === type ? "ALL" : type));
  }, []);

  const handleClickArticle = useCallback(
    (_id: string) => {
      history.push("/user/me/article/" + _id);
    },
    [history]
  );

  return (
    <div className="me">
      {route && renderRoutes(route.routes, route.authed)}

      <div
        className="me-header"
        style={{
          backgroundImage: `url(${QINIU_CLIENT}/light/bg-user-info.jpg)`
        }}
      >
        <MyIcon
          type="setting"
          className="me-header-setting"
          onClick={() => handlePushHistory("setting")}
        />
        <UploadAvatar _id={user._id} hash={user.avatar} />
        <p
          className="me-header-name"
          onClick={() => handlePushHistory("changeInfo")}
        >
          {user.username}
        </p>
        <p
          className="me-header-introduction"
          onClick={() => handlePushHistory("changeInfo")}
        >
          {user.introduction}
        </p>
      </div>

      <div className="me-collections">
        <p className="me-collections-title">我的收藏</p>
        <div className="me-collections-content">
          <div className="me-collections-type">
            <MyIcon
              type="eye"
              className="me-collections-icons"
              onClick={() => handleChangeType("READ")}
            />
            阅读
          </div>
          <div className="me-collections-type">
            <MyIcon
              type="image"
              className="me-collections-icons"
              onClick={() => handleChangeType("IMAGE")}
            />
            图文
          </div>
          <div className="me-collections-type">
            <MyIcon
              type="music"
              className="me-collections-icons"
              onClick={() => handleChangeType("MUSIC")}
            />
            音乐
          </div>
          <div className="me-collections-type">
            <MyIcon
              type="movie"
              className="me-collections-icons"
              onClick={() => handleChangeType("MOVIE")}
            />
            影视
          </div>
          <div className="me-collections-type">
            <MyIcon
              type="fm"
              className="me-collections-icons"
              onClick={() => handleChangeType("FM")}
            />
            电台
          </div>
        </div>
      </div>

      <div className="me-list">
        <p className="me-list-title">{curType} COLLECTIONS</p>
        {curTypeList.length ? (
          curTypeList.map(article => (
            <div
              onClick={() => handleClickArticle(article._id)}
              className="me-list-card"
              key={article._id}
            >
              <img
                alt="cover"
                src={`${QINIU_CLIENT}/${article.cover}`}
                className="me-list-img"
              />
              <p className="me-list-summary">{article.summary}</p>
              <p className="me-list-author">{article.author}</p>
            </div>
          ))
        ) : (
          <Empty description="无收藏文章" style={{ marginTop: 50 }} />
        )}
      </div>
    </div>
  );
};

export default Me;
