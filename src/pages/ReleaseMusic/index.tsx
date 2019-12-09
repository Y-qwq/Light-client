import React from "react";
import ReleaseArticle from "@/components/ReleaseArticle";
import { RouteConfigComponentProps } from "react-router-config";

const ReleaseMusic = (_props: RouteConfigComponentProps) => {
  return <ReleaseArticle type="music" />;
};

export default ReleaseMusic;
