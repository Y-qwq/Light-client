import React, { useEffect, useState, useCallback, useMemo } from "react";
import { RouteConfigComponentProps } from "react-router-config";
import { useLocation, useHistory, useParams } from "react-router";
import { getArticleList, QINIU_CLIENT } from "@/api";
import Header from "@/components/Header";
import { IListData } from "../Light";
import { types } from "../All";
import { Empty } from "antd";
import "./index.scss";

interface IArticleCategoryData extends IListData {
  music?: {
    music_id: string;
    album: string;
    cover: string;
    name: string;
    singers: string;
  };
}

const FETCH_ARTICLE_COUNT = 99;

const ArticleCategory = ({ route }: RouteConfigComponentProps) => {
  const location = useLocation();
  const history = useHistory();
  const params = useParams<{ type: string }>();
  const [type, setType] = useState("");
  const [typeName, setTypeName] = useState("");
  const [data, setData] = useState<IArticleCategoryData[]>([]);

  useEffect(() => {
    setType(params.type);
    types.forEach(item => {
      if (item.type === params.type) setTypeName(item.name);
    });
    (async () => {
      if (params.type) {
        const res = await getArticleList(
          params.type as "fm",
          FETCH_ARTICLE_COUNT
        );
        if (res.data?.type === "success") {
          setData(res.data.list);
        }
      }
    })();
  }, [params.type]);

  const handleClick = useCallback(
    (id: string) => {
      history.push(location.pathname + "/article/" + id);
    },
    [history, location]
  );

  const list = useMemo(() => {
    if (type === "music") {
      return data.map(article => (
        <div
          className="article-category-music"
          key={article._id}
          onClick={() => handleClick(article._id)}
        >
          <img
            className="article-category-music-cover"
            src={`${article.music?.cover}`}
            alt=""
          />
          <p className="article-category-music-title">{article.title}</p>
          <p className="article-category-music-info">
            {article.music?.name}/{article.music?.singers}
          </p>
        </div>
      ));
    } else {
      return data.map(article => (
        <div
          className="article-category-card"
          key={article._id}
          onClick={() => handleClick(article._id)}
        >
          <img
            src={`${QINIU_CLIENT}/${article.cover}`}
            className="article-category-card-image"
            alt="封面"
          />
          <p className="article-category-card-title">{article.title}</p>
          <p className="article-category-card-info">
            {new Date(article.updated).toLocaleDateString()}
            <br />
            {`@${article.author}`}
          </p>
        </div>
      ));
    }
  }, [data, handleClick, type]);

  return (
    <div className="article-category">
      <Header title={`${typeName}列表`} goBackUrl="/user/all" />
      <div className="article-category-list">
        {data.length ? (
          list
        ) : (
          <Empty description="暂无文章" style={{ marginTop: 100 }} />
        )}
      </div>
    </div>
  );
};

export default ArticleCategory;
