import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { QINIU_CLIENT, followUser } from "@/api";
import { loginAction } from "@/redux/action";
import { IState } from "@/redux/reducers";
import { Avatar, message } from "antd";
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
  const dispatch = useDispatch();
  const isFollow = useSelector((state: IState) =>
    new Set(state.user.info.follows).has(_id)
  );
  const user = useSelector((state: IState) => state.user.info);

  const handleFollow = useCallback(async () => {
    if (user._id === _id) {
      message.error("(っ °Д °;)っ 别自恋了亲~");
      return;
    }
    const res = await followUser(user._id, _id, isFollow ? 0 : 1);
    if (res.data.type === "success") {
      const follows = new Set(user.follows);
      isFollow ? follows.delete(_id) : follows.add(_id);
      dispatch(loginAction.updateUserFollows(Array.from(follows)));
    }
  }, [user, _id, isFollow, dispatch]);

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
      <button className="article-author-follow" onClick={handleFollow}>
        {isFollow && "已"}关注
      </button>
    </div>
  );
};

export default ArticleAuthorBar;
