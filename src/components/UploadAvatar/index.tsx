import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  forwardRef
} from "react";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import { Upload, Avatar, Icon } from "antd";
import {
  QINIU_SERVER,
  getForceUploadToken,
  QINIU_CLIENT,
  updateUserAvatar
} from "@/api";
import "./index.scss";

export interface IUploadAvatarProps {
  _id: string;
  name?: string;
  size?: number;
  onChange?: Function;
  value?: string;
}

const UploadAvatar = forwardRef(
  ({ _id, name, size = 64, onChange, value }: IUploadAvatarProps, ref: any) => {
    const [loading, setLoading] = useState(false);
    // 图片hash值，用以控制头像刷新
    const [imgHash, setImgHash] = useState("");
    const [token, setToken] = useState("");

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
            setLoading(false);
          }
        }
      },
      [onChange]
    );

    const beforeUpload = useCallback(async () => {
      const res = await getForceUploadToken("avatar/" + _id);
      res.data.type === "success" && setToken(res.data.token);
    }, [_id]);

    const avatar = useMemo(
      () =>
        imgHash ? (
          <Avatar
            size={size}
            src={`${QINIU_CLIENT}/avatar/${_id}?h=${imgHash}`}
            className={`loading-box-img`}
          >
            {name ? name : "U"}
          </Avatar>
        ) : (
          <Avatar size={size} className={`loading-box-img`}>
            {name ? name : "U"}
          </Avatar>
        ),
      [name, imgHash, size, _id]
    );

    return (
      <Upload
        ref={ref}
        listType="picture"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        action={QINIU_SERVER}
        data={{
          token: token,
          key: `avatar/${_id}`
        }}
        onChange={handleChange}
      >
        <div className={`loading-box ${loading ? "loading" : null}`}>
          {avatar}
          {loading && (
            <Icon
              type="loading"
              className="loading-box-icon"
              style={{ fontSize: size / 2 }}
            />
          )}
        </div>
      </Upload>
    );
  }
);

export default UploadAvatar;
