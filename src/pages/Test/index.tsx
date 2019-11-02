import React, { useEffect } from "react";
import { Button } from "antd";
import MyIcon from "@/assets/MyIcon";

const Test: React.FC = () => {
  useEffect(() => {
    console.log("test");
  }, []);
  return (
    <>
      <MyIcon type="xiangji"/>
      <Button>Test</Button>
    </>
  );
};

export default Test;
