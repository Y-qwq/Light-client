import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { getArticleList, QINIU_CLIENT } from "@/api";
import InfiniteScroll from "react-infinite-scroller";
import HideOnScroll from "@/common/HideOnScroll";
import { message, Carousel, List } from "antd";
import Loading from "@/common/Loading";
import { IListData } from "../Light";
import MyIcon from "@/assets/MyIcon";
import "./index.scss";

export const types = [
  { name: "阅读", type: "read" },
  { name: "图文", type: "image" },
  { name: "音乐", type: "music" },
  { name: "电台", type: "fm" },
  { name: "影视", type: "movie" }
];

const FETCH_ARTICLE_COUNT = 5;

const now = new Date().toLocaleDateString();
const translateTime = (time: string) => {
  const t = new Date(time).toLocaleDateString();
  return t === now ? "今天" : t;
};

const All = () => {
  const history = useHistory();
  const RouteMatch = useRouteMatch("/user/all");
  const [stopScroll, setStopScroll] = useState(false);
  const [bannerData, setBannerData] = useState<IListData[]>();
  const [data, setData] = useState<IListData[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getArticleList("recommend", 4);
      if (res.data.type === "success") {
        setBannerData(res.data.list || []);
      } else {
        message.error("获取Banner数据失败!");
      }
    })();
  }, []);

  useEffect(() => {
    setStopScroll(() => (RouteMatch?.isExact ? false : true));
  }, [RouteMatch]);

  // 无限滚动获取数据 and 初始化获取数据
  const handleFetchData = useCallback(async () => {
    setLoadingMore(true);
    const res = await getArticleList(
      "all",
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

  const handleClickArticle = useCallback(
    (_id: string) => {
      history.push(`/user/all/article/${_id}`);
    },
    [history]
  );

  const handleClickType = useCallback(
    (type: string) => {
      history.push("/user/category/" + type);
    },
    [history]
  );

  return (
    <div className="all" style={{ overflow: stopScroll ? "hidden" : "" }}>
      <HideOnScroll>
        <header className="all-header">
          <p className="all-header-logo">Light</p>
          <MyIcon type="zoom" className="all-header-search-icon" />
        </header>
      </HideOnScroll>
      {bannerData && (
        <Carousel autoplay>
          {bannerData.map(banner => (
            <div className="all-banner" key={banner._id}>
              <img
                src={`${QINIU_CLIENT}/${banner.cover}`}
                onClick={() => handleClickArticle(banner._id)}
                className="all-banner-img"
                alt="Banner"
              />
            </div>
          ))}
        </Carousel>
      )}
      <div className="all-type">
        {types.map(({ type, name }) => (
          <div
            className="all-type-box"
            key={type}
            onClick={() => handleClickType(type)}
          >
            <img
              src={`${QINIU_CLIENT}/light/all-${type}.jpg`}
              className="all-type-img"
              alt={name}
            />
            <p className="all-type-name">{name}</p>
          </div>
        ))}
      </div>
      <InfiniteScroll
        initialLoad={true}
        loadMore={handleFetchData}
        hasMore={!loadingMore && hasMore}
        useWindow={true}
      >
        {data.length ? (
          <List
            className="all-list"
            dataSource={data}
            split={false}
            renderItem={item => (
              <List.Item
                key={item._id}
                onClick={() => handleClickArticle(item._id)}
              >
                <div className="all-item">
                  <p className="all-item-type">{`- ${
                    types.filter(v => v.type === item.type)[0].name
                  } -`}</p>
                  <p className="all-item-title">{item.title}</p>
                  <p className="all-item-type-author">{`${item.author}`}</p>
                  <img
                    src={`${QINIU_CLIENT}/${item.cover}`}
                    alt="cover"
                    className="all-item-cover"
                  />
                  <p className="all-item-summary">{item.summary}</p>
                  <div className="all-item-footer">
                    <p className="all-item-time">
                      {translateTime(item.created)}
                    </p>
                    <div className="all-item-read_number">
                      <MyIcon
                        type="eye1"
                        className="all-item-read_number-icon"
                      />
                      阅读量: {item.reading_number}
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
    </div>
  );
};

export default All;
