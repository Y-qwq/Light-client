import React from "react";
import { QINIU_CLIENT } from "@/api";
import { Avatar } from "antd";
import "./index.scss";

interface IAuthorBar {
  _id: string;
  avatar?: string;
  username: string;
  introduction?: string;
}

const ArticleAuthorBar = ({
  _id,
  avatar,
  username,
  introduction
}: IAuthorBar) => {
  return (
    <div className="article-author-bar">
      <Avatar
        src={`${QINIU_CLIENT}/avatar/${_id}?h=${avatar}`}
        className="article-author-avatar"
        size={44}
      >
        A
      </Avatar>
      <div className="article-author-content">
        <p className="article-author-name">{username}</p>
        <p className="article-author-introduction">
          {introduction || "这个人很懒，什么也没留下~"}
        </p>
      </div>
      <button className="article-author-follow">关注</button>
    </div>
  );
};

export default ArticleAuthorBar;
