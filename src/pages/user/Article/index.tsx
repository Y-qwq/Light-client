import React, { useEffect, useState, useRef } from "react";
import { useLocation, useHistory } from "react-router";
import { getArticleDetail, QINIU_CLIENT } from "@/api";
import HideOnScroll from "@/commom/HideOnScroll";
import Loading from "@/commom/Loading";
import MyIcon from "@/assets/MyIcon";
import { Icon } from "antd";
import "./index.scss";

interface IArticleData {
  _id: string;
  author: string;
  author_id: string;
  type: string;
  title: string;
  cover: string;
  summary: string;
  content: string;
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
  ["read", "阅读"],
  ["fm", "电台"],
  ["movie", "电影"],
  ["music", "音乐"],
  ["image", "图文"]
]);

const Article = () => {
  const location = useLocation();
  const history = useHistory();
  const [article, setArticle] = useState<IArticleData>();
  const contentRef = useRef<any>();

  useEffect(() => {
    (async () => {
      const _id = location.pathname.split("/").pop();
      const res = await getArticleDetail(_id as string);
      setArticle(res.data.article);
    })();
  }, [location]);

  return (
    <div className="article" ref={contentRef}>
      <HideOnScroll target={contentRef.current}>
        <header className="article-header">
          <Icon
            type="left"
            onClick={() => history.goBack()}
            className="article-header-left-icon"
          />
          <p className="article-header-type">
            {article && typeMap.get(article.type)}
          </p>
          <div className="article-header-icons">
            <MyIcon type="collection" className="article-header-icons-icon" />
            <MyIcon type="heart" className="article-header-icons-icon" />
          </div>
        </header>
      </HideOnScroll>
      {article ? (
        <article className="article-content">
          <h1 className="article-title">{article.title}</h1>
          <p className="article-author">{article.author}</p>
          <img
            className="article-cover"
            src={`${QINIU_CLIENT}/${article.cover}`}
            alt="cover"
          />
          <main dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>
      ) : (
        <Loading />
      )}
      <footer className="article-footer">
        <input
          type="text"
          className="article-footer-comment"
          placeholder="评论一下..."
        />
        <button className="article-footer-submit">发布</button>
      </footer>
    </div>
  );
};

export default Article;
