import React, { useEffect, useState, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getArticleDetail, QINIU_CLIENT } from "@/api";
import { IArticleData } from "@/pages/user/Article";
import Loading from "@/common/Loading";
import { Icon } from "antd";
import "./index.scss";

const Article = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const [article, setArticle] = useState<IArticleData>();

  useEffect(() => {
    (async () => {
      const res = await getArticleDetail(params.id);
      setArticle(res.data.article);
    })();
  }, [params.id]);

  const goBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <article className="preview-article">
      <Icon type="left" className="preview-article-back" onClick={goBack} />
      {article ? (
        <div className="preview-article-content">
          <img
            src={`${QINIU_CLIENT}/${article.cover}`}
            alt="cover"
            className="preview-article-cover"
          />
          <h1 className="preview-article-title">{article.title}</h1>
          <div className="preview-article-author">
            {article.author.username}
          </div>
          <main dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      ) : (
        <Loading />
      )}
    </article>
  );
};

export default Article;
