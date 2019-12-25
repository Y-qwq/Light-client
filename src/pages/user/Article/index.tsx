import React, { useEffect, useState, useRef, useCallback } from "react";
import useStarOrCollectArticle from "@/hooks/useStarOrCollectArticle";
import ArticleMusicHeader from "@/components/ArticleMusicHeader";
import ArticleAuthorBar from "@/components/ArticleAuthorBar";
import ArticleFmHeader from "@/components/ArticleFmHeader";
import { getArticleDetail, QINIU_CLIENT } from "@/api";
import { useLocation, useHistory } from "react-router";
import HideOnScroll from "@/commom/HideOnScroll";
import Loading from "@/commom/Loading";
import MyIcon from "@/assets/MyIcon";
import { Icon } from "antd";
import "./index.scss";

interface IArticleData {
  _id: string;
  author: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
    introduction?: string;
    collecetions: [];
    stars: [];
  };
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
  fmUrl?: string;
  music?: {
    count: number;
    _id: string;
    music_id: string;
    album: string;
    cover: string;
    created: string;
    name: string;
    singers: string;
    updated: string;
  };
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
  const [stars, handleStarArticle] = useStarOrCollectArticle("star");
  const [collections, handleCollectArticle] = useStarOrCollectArticle(
    "collect"
  );
  const [article, setArticle] = useState<IArticleData>();
  const contentRef = useRef<any>();

  useEffect(() => {
    (async () => {
      const _id = location.pathname.split("/").pop();
      const res = await getArticleDetail(_id as string);
      setArticle(res.data.article);
    })();
  }, [location]);

  const handleStar = useCallback(() => {
    article && handleStarArticle(article._id, stars.has(article._id) ? 0 : 1);
  }, [article, handleStarArticle, stars]);

  const handleCollect = useCallback(() => {
    article &&
      handleCollectArticle(article._id, collections.has(article._id) ? 0 : 1);
  }, [article, handleCollectArticle, collections]);

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
            <MyIcon
              type={
                article && collections.has(article._id)
                  ? "collection-active"
                  : "collection"
              }
              className="article-header-icons-icon"
              onClick={handleCollect}
            />
            <MyIcon
              type={
                article && stars.has(article._id) ? "heart-active" : "heart"
              }
              className="article-header-icons-icon"
              onClick={handleStar}
            />
          </div>
        </header>
      </HideOnScroll>
      {article ? (
        <article className="article-content">
          <h1 className="article-title">{article.title}</h1>
          <p className="article-author">{article.author.username}</p>
          {article?.music && <ArticleMusicHeader {...article.music} />}
          {article.type === "fm" && article.fmUrl && (
            <ArticleFmHeader
              fmUrl={article.fmUrl}
              author={article.author.username}
            />
          )}
          <img
            className="article-cover"
            src={`${QINIU_CLIENT}/${article.cover}`}
            alt="cover"
          />
          <main dangerouslySetInnerHTML={{ __html: article.content }} />
          <div className="article-info">
            <p className="article-info-read">
              {`阅读 ${article.reading_number}`}
            </p>
            <p className="article-info-updated">
              {`更新于 ${new Date(article.updated).toLocaleDateString()}`}
            </p>
          </div>

          <div className="article-author-info">
            <p className="article-author-info-title">作者</p>
            <ArticleAuthorBar
              _id={article.author_id}
              avatar={article.author.avatar}
              username={article.author.username}
              introduction={article.author.introduction}
            />
          </div>
        </article>
      ) : (
        <Loading />
      )}
      <div className="article-footer">
        <input
          type="text"
          className="article-footer-comment"
          placeholder="评论一下..."
        />
        <button className="article-footer-submit">发布</button>
      </div>
    </div>
  );
};

export default Article;
