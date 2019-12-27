import React, { useState, useEffect, useMemo } from "react";
import { IComments, ICommentators } from "@/pages/user/Article";
import "./index.scss";
import { Avatar, Badge } from "antd";
import { QINIU_CLIENT } from "@/api";
import { useSelector } from "react-redux";
import { IState } from "@/redux/reducers";
import MyIcon from "@/assets/MyIcon";
import getTime from "@/util/getTime";

interface ICommentBar {
  comments: IComments;
  commentators: ICommentators;
}

const ArticleCommentBar = ({ comments, commentators }: ICommentBar) => {
  const user = useSelector((state: IState) => state.user.info);
  const [commentatorsMap, setcommentatorsMap] = useState<
    Map<string, { username: string; avatar: string; _id: string }>
  >(new Map());

  useEffect(() => {
    const map = new Map();
    for (const commentator of commentators) {
      map.set(commentator._id, {
        avatar: commentator.avatar,
        username: commentator.username
      });
    }
    map.set(user._id, { avatar: user.avatar, username: user.username });
    setcommentatorsMap(map);
  }, [commentators, user._id, user.avatar, user.username]);

  const renderList = useMemo(
    () =>
      comments
        //@ts-ignore
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .map(comment => {
          return (
            <div className="comment-bar" key={comment._id}>
              <div className="comment-bar-header">
                {commentatorsMap.get(comment.commentator_id)?.avatar ? (
                  <Avatar
                    size={24}
                    className="comment-bar-header-avatar"
                    src={`${QINIU_CLIENT}/avatar/${comment.commentator_id}?h=${
                      commentatorsMap.get(comment.commentator_id)?.avatar
                    }`}
                  >
                    U
                  </Avatar>
                ) : (
                  <Avatar size={24} className="comment-bar-header-username">
                    U
                  </Avatar>
                )}
                <p className="comment-bar-header-username">
                  {commentatorsMap.get(comment.commentator_id)?.username}
                </p>
                <p className="comment-bar-header-created">
                  {getTime(comment.created)}
                </p>
              </div>
              <div className="comment-bar-content">{comment.content}</div>
              <div className="comment-bar-footer">
                <MyIcon type="comment" className="comment-bar-footer-icons" />
                <Badge
                  count={<p style={{ fontSize: 10 }}>{comment.star_number}</p>}
                  offset={[-8, 0]}
                  showZero
                >
                  <MyIcon type="dianzan" className="comment-bar-footer-icons" />
                </Badge>
              </div>
            </div>
          );
        }),
    [comments, commentatorsMap]
  );

  return <div className="article-comments">{renderList}</div>;
};

export default ArticleCommentBar;
