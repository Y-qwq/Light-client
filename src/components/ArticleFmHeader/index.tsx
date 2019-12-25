import React, { useState, useRef, useCallback, useEffect } from "react";
import { QINIU_CLIENT } from "@/api";
import MyIcon from "@/assets/MyIcon";
import "./index.scss";

interface IArticleFmProps {
  fmUrl: string;
  author: string;
}

const ArticleFmHeader = ({ fmUrl, author }: IArticleFmProps) => {
  const playerRef = useRef<any>();
  const [playState, setPlayState] = useState(false);
  const [duration, setDuration] = useState("");

  const getMetadata = useCallback(
    (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
      //@ts-ignore
      const duration: number = e.target.duration;
      if (duration && !isNaN(duration)) {
        let min: any = ~~(duration / 60);
        let sec: any = ~~duration % 60;
        min = min < 10 ? `0${min}` : min;
        sec = sec < 10 ? `0${sec}` : sec;
        setDuration(`${min}:${sec}`);
      }
    },
    []
  );

  useEffect(() => {
    if (playState) {
      playerRef.current?.play?.();
    } else {
      playerRef.current?.pause?.();
    }
  }, [playState]);

  return (
    <div
      className="article-fm-header"
      onClick={() => setPlayState(pre => !pre)}
    >
      <MyIcon
        className="article-fm-volume"
        type={`volume${playState ? "-active" : ""}`}
      />
      <p className="article-fm-info">{`有声电台  |  ${author}`}</p>
      <p className="article-fm-time">{duration}</p>
      <audio
        ref={playerRef}
        preload="metadata"
        src={`${QINIU_CLIENT}/${fmUrl}`}
        onDurationChange={getMetadata}
      />
    </div>
  );
};

export default ArticleFmHeader;
