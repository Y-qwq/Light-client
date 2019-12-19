import React from "react";
import { useScrollTrigger, Slide } from "@material-ui/core";

interface IHideOnScrollProps {
  target?: any;
  children: React.ReactElement;
}

/**
 *
 * @param target React.Ref.current
 */
const HideOnScroll = ({ children, target }: IHideOnScrollProps) => {
  const trigger = useScrollTrigger({ target: target ? target : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

export default HideOnScroll;
