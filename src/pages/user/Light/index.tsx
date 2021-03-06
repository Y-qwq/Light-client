import React, { useEffect, useState, useCallback } from "react";
import useStarOrCollectArticle from "@/hooks/useStarOrCollectArticle";
import { useHistory, useRouteMatch } from "react-router";
import { getArticleList, QINIU_CLIENT } from "@/api";
import InfiniteScroll from "react-infinite-scroller";
import HideOnScroll from "@/common/HideOnScroll";
import { List, Badge, message, Spin } from "antd";
import Loading from "@/common/Loading";
import MyIcon from "@/assets/MyIcon";
import "./index.scss";

export interface IListData {
  _id: string;
  author: string;
  author_id: string;
  type: string;
  title: string;
  cover: string;
  summary: string;
  banned: number;
  pass: number;
  recommend: number;
  collection_number: number;
  comment_number: number;
  reading_number: number;
  star_number: number;
  created: string;
  updated: string;
}

const FETCH_ARTICLE_COUNT = 5;

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

// LIGHT 为推荐文章阅读模块
const Light = () => {
  const history = useHistory();
  const RouteMatch = useRouteMatch("/user/light");
  const [data, setData] = useState<IListData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [stopScroll, setStopScroll] = useState(false);

  const [stars, handleStarArticle] = useStarOrCollectArticle("star");
  const [collections, handleCollectArticle] = useStarOrCollectArticle(
    "collect"
  );

  useEffect(() => {
    setStopScroll(() => (RouteMatch?.isExact ? false : true));
  }, [RouteMatch]);

  const readArticle = useCallback(
    (_id: string) => {
      history.push(`/user/light/article/${_id}`);
    },
    [history]
  );

  // 无限滚动获取数据 and 初始化获取数据
  const handleFetchData = useCallback(async () => {
    setLoadingMore(true);
    const res = await getArticleList(
      "recommend",
      FETCH_ARTICLE_COUNT,
      (data || []).length
    );
    if (res.data.type === "success") {
      const resData = res.data.list || [];
      setData(preData => [...preData, ...resData]);
      if (resData.length === 0) {
        message.warning("w(ﾟДﾟ)w 数据库已经被掏空啦~");
        setHasMore(false);
      }
      setLoadingMore(false);
    }
  }, [data]);

  const handleIcons = useCallback(
    (
      e: React.MouseEvent<HTMLElement, MouseEvent>,
      type: string,
      _id: string,
      isAdd: boolean
    ) => {
      e.stopPropagation();
      if (type === "star") {
        handleStarArticle(_id, isAdd ? 1 : 0);
      } else {
        handleCollectArticle(_id, isAdd ? 1 : 0);
      }
    },
    [handleStarArticle, handleCollectArticle]
  );

  return (
    <div className="light" style={{ overflow: stopScroll ? "hidden" : "" }}>
      <HideOnScroll>
        <header className="light-header">
          <p className="light-header-logo">Light</p>
        </header>
      </HideOnScroll>
      <InfiniteScroll
        initialLoad={true}
        loadMore={handleFetchData}
        hasMore={!loadingMore && hasMore}
        useWindow={true}
      >
        {data.length || stopScroll ? (
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
                          type={`collection${
                            collections.has(item._id) ? "-active" : ""
                          }`}
                          className="light-item-icons-icon"
                          onClick={e =>
                            handleIcons(
                              e,
                              "collection",
                              item._id,
                              !collections.has(item._id)
                            )
                          }
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
                          type={`heart${stars.has(item._id) ? "-active" : ""}`}
                          className="light-item-icons-icon"
                          onClick={e =>
                            handleIcons(
                              e,
                              "star",
                              item._id,
                              !stars.has(item._id)
                            )
                          }
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
      </InfiniteScroll>
      {data.length && loadingMore && hasMore && (
        <Spin className="light-loading" />
      )}
    </div>
  );
};

export default Light;
