import React, { useEffect, useState, useCallback } from "react";
import { RouteConfigComponentProps } from "react-router-config";
import { useHistory, useLocation } from "react-router";
import { getArticleList, QINIU_CLIENT } from "@/api";
import HideOnScroll from "@/commom/HideOnScroll";
import renderRoutes from "@/router/renderRoutes";
import { List, message, Badge } from "antd";
import Loading from "@/commom/Loading";
import MyIcon from "@/assets/MyIcon";
import "./index.scss";

interface IListData {
  _id: string;
  author: string;
  author_id: string;
  type: string;
  title: string;
  cover: string;
  summary: string;
  banned: number;
  pass: number;
  collection_number: number;
  comment_number: number;
  reading_number: number;
  star_number: number;
  created: string;
  updated: string;
}

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

const Light = ({ route }: RouteConfigComponentProps) => {
  const history = useHistory();
  const location = useLocation();
  const [data, setData] = useState<IListData[]>();
  const [stopScroll, setStopScroll] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getArticleList("recommend", 20);
      if (res.data.type === "success") {
        setData(res.data.list || []);
      } else {
        message.error("获取数据失败!");
      }
    })();
  }, []);

  useEffect(() => {
    if (/^\/user\/light\/article\/.*?$/.test(location.pathname)) {
      setStopScroll(true);
    } else {
      setStopScroll(false);
    }
  }, [location]);

  const readArticle = useCallback(
    (_id: string) => {
      history.push(`/user/light/article/${_id}`);
    },
    [history]
  );

  const handleIcons = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>, type: string) => {
      e.stopPropagation();
      console.log(type);
    },
    []
  );

  return (
    <>
      {route && renderRoutes(route.routes, route.authed)}
      <div className="light" style={{ overflow: stopScroll ? "hidden" : "" }}>
        <HideOnScroll>
          <header className="light-header">
            <p className="light-header-logo">Light</p>
            <MyIcon type="zoom" className="light-header-search-icon" />
          </header>
        </HideOnScroll>
        {data ? (
          <List
            className="light-list"
            dataSource={data}
            renderItem={item => (
              <List.Item key={item._id} onClick={() => readArticle(item._id)}>
                <div className="light-item">
                  <p className="light-item-title">{item.title}</p>
                  <p className="light-item-type-author">{`${typeMap.get(
                    item.type
                  )} ╱ ${item.author}`}</p>
                  <img
                    src={`${QINIU_CLIENT}/${item.cover}`}
                    alt="cover"
                    className="light-item-cover"
                  />
                  <p className="light-item-summary">{item.summary}</p>
                  <div className="light-item-footer">
                    <p className="light-item-time">
                      {translateTime(item.created)}
                    </p>
                    <div className="light-item-icons">
                      <Badge
                        count={
                          <p style={{ fontSize: 10 }}>
                            {item.collection_number}
                          </p>
                        }
                        offset={[0, 3]}
                        showZero
                      >
                        <MyIcon
                          type="collection"
                          className="light-item-icons-icon"
                          onClick={e => handleIcons(e, "collection")}
                        />
                      </Badge>
                      <Badge
                        count={
                          <p style={{ fontSize: 10 }}>{item.star_number}</p>
                        }
                        offset={[0, 3]}
                        showZero
                      >
                        <MyIcon
                          type="heart"
                          className="light-item-icons-icon"
                          onClick={e => handleIcons(e, "star")}
                        />
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
    </>
  );
};

export default Light;
