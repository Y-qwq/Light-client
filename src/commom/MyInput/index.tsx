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
  borderColor?: string;
}

const MyInput = ({
  className,
  name,
  type,
  onBlur,
  onChange,
  onKeyDown,
  placeholder,
  value,
  borderColor
}: IMyInput) => {
  return (
    <div className={`my-input-box ${className}`}>
      <div className="my-input-name">{name}</div>
      <input
        onKeyDown={onKeyDown}
        type={type ? type : "text"}
        className="my-input-text"
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        value={value}
        style={{ borderColor }}
      />
    </div>
  );
};

export default MyInput;
