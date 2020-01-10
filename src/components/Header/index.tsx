import React, { useCallback } from "react";
import { useHistory } from "react-router";
import { Icon } from "antd";
import "./index.scss";

interface IHeader {
  goBackUrl?: string;
  title: string;
  position?: "center" | "left";
}

const Header = ({ goBackUrl, title, position = "center" }: IHeader) => {
  const history = useHistory();

  const goBack = useCallback(() => {
    if (goBackUrl) {
      history.push(goBackUrl);
    } else {
      history.goBack();
    }
  }, [history, goBackUrl]);

  return (
    <header className="article-list-header">
      <Icon type="left" onClick={goBack} className="article-list-header-back" />
      <p
        className={`article-list-header-title${
          position === "center" ? "-center" : ""
        }`}
      >
        {title}
      </p>
    </header>
  );
};

export default Header;
