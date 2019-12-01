import React, { useState, useCallback, useMemo } from "react";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import { Upload, Avatar, Icon } from "antd";
import { QINIU_SERVER, getForceUploadToken, QINIU_CLIENT } from "@/api";
import "./index.scss";

export interface IUploadAvatarProps {
  _id: string;
  name?: string;
  size?: number;
  onChange?: Function;
}

const UploadAvatar = ({
  _id,
  name,
  size = 64,
  onChange
}: IUploadAvatarProps) => {
  const [loading, setLoading] = useState(false);
  // 图片是否存在
  const [validUrl, setValidUrl] = useState(true);
  // 图片hash值，用以控制头像刷新
  const [imgHash, setImgHash] = useState("");
  const [token, setToken] = useState("");

  const handleChange = useCallback(
    (info: UploadChangeParam<UploadFile<any>>) => {
      onChange && onChange(info);

      if (info.file.status === "uploading") {
        setLoading(true);
        return;
      }
      if (info.file.status === "done") {
        setImgHash(info.file.response.hash);
        setLoading(false);
        setValidUrl(true);
      }
    },
    [onChange]
  );

  const beforeUpload = useCallback(async () => {
    const res = await getForceUploadToken("avatar/" + _id);
    res.data.type === "success" && setToken(res.data.token);
  }, [_id]);

  const getAvatarFail = useCallback(() => {
    setValidUrl(false);
    return false;
  }, []);

  const avatar = useMemo(
    () => (
      <Avatar
        key={imgHash}
        size={size}
        src={`${QINIU_CLIENT}/avatar/${_id}?v=${+new Date()}`}
        className={`loading-box-img`}
        onError={getAvatarFail}
      />
    ),
    [imgHash, getAvatarFail, size, _id]
  );

  return (
    <Upload
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
      {validUrl ? (
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
      ) : (
        <Avatar className="avatar-uploader-img" size={size}>
          {name ? name : "U"}
        </Avatar>
      )}
    </Upload>
  );
};

export default UploadAvatar;
