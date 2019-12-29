import React from "react";
import "./index.scss";

interface ILongButton {
  action?: boolean | string;
  text: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
}

const LongButton = ({ action = true, onClick, text, className }: ILongButton) => (
  <button
    className={`long-button ${action ? "long-button-action" : ""} ${className ? className : ""}`}
    onClick={action ? onClick : undefined}
  >
    {text}
  </button>
);

export default LongButton;
