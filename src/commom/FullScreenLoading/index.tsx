import React from "react";
import { Spin } from "antd";

const FullScreenLoading: React.FC = () => {
  return (
    <Spin
      tip="Loading"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }}
    />
  );
};

export default FullScreenLoading;
