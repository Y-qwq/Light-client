import React from "react";
import "./index.scss";

interface IMyInput {
  name: string;
  className?: string;
  onChange?: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
  onBlur?: ((event: React.FocusEvent<HTMLInputElement>) => void) | undefined;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  value?: string | number | string[];
}

const MyInput = (props: IMyInput) => {
  return (
    <div className={`my-input-box ${props.className}`}>
      <div className="my-input-name">{props.name}</div>
      <input
        onKeyDown={props.onKeyDown}
        type={props.type ? props.type : "text"}
        className="my-input-text"
        onChange={props.onChange}
        onBlur={props.onBlur}
        placeholder={props.placeholder}
        value={props.value}
      />
    </div>
  );
};

export default MyInput;
