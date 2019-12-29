import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  forwardRef
} from "react";
import { QINIU_CLIENT, updateUserAvatar } from "@/api";
import { UploadFile } from "antd/lib/upload/interface";
import { UploadChangeParam } from "antd/lib/upload";
import QiniuUpload from "@/common/QiniuUpload";
import { loginAction } from "@/redux/action";
import { useDispatch } from "react-redux";
import { Avatar, Icon } from "antd";
import "./index.scss";

export interface IUploadAvatarProps {
  _id: string;
  name?: string;
  size?: number;
  onChange?: Function;
  value?: string;
  hash?: String;
}

const UploadAvatar = forwardRef(
  (
    { _id, name, size = 64, onChange, value, hash = "" }: IUploadAvatarProps,
    ref: any
  ) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    // 图片hash值，用以控制头像刷新
    const [imgHash, setImgHash] = useState(hash);
    const [getPicFail, setGetPicFail] = useState(false);

    useEffect(() => {
      if (value) setImgHash(value);
    }, [value]);

    const handleChange = useCallback(
      async (info: UploadChangeParam<UploadFile<any>>) => {
        if (info.file.status === "uploading") {
          setLoading(true);
          return;
        }
        if (info.file.status === "done") {
          const hash = info.file.response.hash;
          const res = await updateUserAvatar(hash);
          if (res.data.type === "success") {
            setImgHash(hash);
            onChange && onChange(hash);
            dispatch(loginAction.updateAvatarHash(hash));
            setLoading(false);
          }
        }
      },
      [onChange, dispatch]
    );

    const avatar = useMemo(
      () =>
        imgHash && !getPicFail ? (
          <Avatar
            size={size}
            src={`${QINIU_CLIENT}/avatar/${_id}?h=${imgHash}`}
            className={`loading-box-img`}
            onError={() => {
              setGetPicFail(true);
              return true;
            }}
          >
            {name ? name : "U"}
          </Avatar>
        ) : (
          <Avatar size={size} className={`loading-box-img`}>
            {name ? name : "U"}
          </Avatar>
        ),
      [name, imgHash, size, getPicFail, _id]
    );

    return (
      <QiniuUpload
        ref={ref}
        listType="picture"
        className="avatar-uploader"
        onChange={handleChange}
        path={`avatar/${_id}`}
        forceUpload={true}
      >
        <div className={`loading-box ${loading ? "loading" : ""}`}>
          {avatar}
          {loading && (
            <Icon
              type="loading"
              className="loading-box-icon"
              style={{ fontSize: size / 2 }}
            />
          )}
        </div>
      </QiniuUpload>
    );
  }
);

export default UploadAvatar;
