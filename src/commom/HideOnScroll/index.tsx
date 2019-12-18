import React from "react";
import { useScrollTrigger, Slide } from "@material-ui/core";

const HideOnScroll: React.SFC = ({ children }) => {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

export default HideOnScroll;
