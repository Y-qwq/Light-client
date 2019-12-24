import React, { useState, useRef, useEffect } from "react";
import { QINIU_CLIENT } from "@/api";
import MyIcon from "@/assets/MyIcon";
import "./index.scss";

export interface IMusic {
  count: number;
  _id: string;
  music_id: string;
  album: string;
  cover: string;
  created: string;
  name: string;
  singers: string;
  updated: string;
}

const ArticleMusicHeader = ({ cover, singers, name, music_id }: IMusic) => {
  const playerRef = useRef<any>();
  const [playState, setPlayState] = useState(false);

  useEffect(() => {
    if (playState) {
      playerRef?.current?.play?.();
    } else {
      playerRef?.current?.pause?.();
    }
  }, [playState]);

  return (
    <header className="article-music-header">
      <img src={cover} alt="封面" className="article-music-cover" />
      <MyIcon
        type={playState ? "stop" : "play"}
        className="article-music-controller"
        onClick={() => setPlayState(pre => !pre)}
      />
      <div className="article-music-info">
        <p className="article-music-name">{name}</p>
        <p className="article-music-author">{singers}</p>
      </div>
      <audio src={`${QINIU_CLIENT}/music/${music_id}.mp3`} ref={playerRef} />
    </header>
  );
};

export default ArticleMusicHeader;
