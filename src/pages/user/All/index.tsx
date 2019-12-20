import React, { useState, useEffect, useCallback } from "react";
import { RouteConfigComponentProps } from "react-router-config";
import { message, Carousel, List, Badge } from "antd";
import { getArticleList, QINIU_CLIENT } from "@/api";
import renderRoutes from "@/router/renderRoutes";
import { useHistory } from "react-router";
import Loading from "@/commom/Loading";
import MyIcon from "@/assets/MyIcon";
import { IListData } from "../Light";
import "./index.scss";

const types = [
  { name: "阅读", type: "read" },
  { name: "图文", type: "image" },
  { name: "音乐", type: "music" },
  { name: "电台", type: "fm" },
  { name: "影视", type: "movie" }
];

const typeMap = new Map([
  ["read", "文"],
  ["fm", "聼"],
  ["movie", "影"],
  ["music", "樂"],
  ["image", "圖"]
]);

const now = new Date().toLocaleDateString();
const translateTime = (time: string) => {
  const t = new Date(time).toLocaleDateString();
  return t === now ? "今天" : t;
};

const All = ({ route }: RouteConfigComponentProps) => {
  const history = useHistory();
  const [bannerData, setBannerData] = useState<IListData[]>();
  const [data, setData] = useState<IListData[]>();

  useEffect(() => {
    (async () => {
      const res = await getArticleList("recommend", 4);
      if (res.data.type === "success") {
        setBannerData(res.data.list || []);
      } else {
        message.error("获取Banner数据失败!");
      }
    })();
    (async () => {
      const res = await getArticleList("all", 20);
      if (res.data.type === "success") {
        setData(res.data.list || []);
      } else {
        message.error("获取数据失败!");
      }
    })();
  }, []);

  const readArticle = useCallback(
    (_id: string) => {
      history.push(`/user/all/article/${_id}`);
    },
    [history]
  );

  return (
    <div className="all">
      {route && renderRoutes(route.routes, route.authed)}
      {bannerData && (
        <Carousel autoplay>
          {bannerData.map(banner => (
            <div className="all-banner">
              <img
                src={`${QINIU_CLIENT}/${banner.cover}`}
                onClick={() => readArticle(banner._id)}
                className="all-banner-img"
                alt="Banner"
              />
            </div>
          ))}
        </Carousel>
      )}
      <div className="all-type">
        {types.map(({ type, name }) => (
          <div className="all-type-box" key={type}>
            <img
              src={`${QINIU_CLIENT}/light/all-${type}.jpg`}
              className="all-type-img"
              alt={name}
            />
            <p className="all-type-name">{name}</p>
          </div>
        ))}
      </div>
      {data ? (
        <List
          className="all-list"
          dataSource={data}
          renderItem={item => (
            <List.Item key={item._id} onClick={() => readArticle(item._id)}>
              <div className="all-item">
                <p className="all-item-title">{item.title}</p>
                <p className="all-item-type-author">{`${typeMap.get(
                  item.type
                )} ╱ ${item.author}`}</p>
                <img
                  src={`${QINIU_CLIENT}/${item.cover}`}
                  alt="cover"
                  className="all-item-cover"
                />
                <p className="all-item-summary">{item.summary}</p>
                <div className="all-item-footer">
                  <p className="all-item-time">{translateTime(item.created)}</p>
                  <div className="all-item-icons">
                    <Badge
                      count={
                        <p style={{ fontSize: 10 }}>{item.collection_number}</p>
                      }
                      offset={[0, 3]}
                      showZero
                    >
                      <MyIcon
                        type="collection"
                        className="all-item-icons-icon"
                      />
                    </Badge>
                    <Badge
                      count={<p style={{ fontSize: 10 }}>{item.star_number}</p>}
                      offset={[0, 3]}
                      showZero
                    >
                      <MyIcon type="heart" className="all-item-icons-icon" />
                    </Badge>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default All;
