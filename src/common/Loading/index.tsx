import React from "react";
import { Spin } from "antd";

const Loading: React.FC = () => {
  return (
    <Spin
      tip="Loading"
      style={{
        position: "absolute",
        zIndex: 99,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }}
    />
  );
};

export default Loading;
