import React, { ReactNode, forwardRef, useCallback, useState } from "react";
import { Upload } from "antd";
import { QINIU_SERVER, getForceUploadToken } from "@/api";
import { useSelector } from "react-redux";
import { IState } from "@/redux/reducers";
import {
  RcFile,
  UploadChangeParam,
  UploadFile
} from "antd/lib/upload/interface";

export interface IQiniuUpload {
  beforeUpload?: (
    file: RcFile,
    FileList: RcFile[]
  ) => boolean | PromiseLike<void>;
  onChange?: (info: UploadChangeParam<UploadFile<any>>) => void;
  path?: string;
  children?: ReactNode;
  className?: string;
  listType?: "picture" | "text" | "picture-card" | undefined;
  token?: string;
  accept?: string;
  forceUpload?: boolean;
}
const QiniuUpload = forwardRef(
  (
    {
      beforeUpload,
      onChange,
      path,
      children,
      className,
      listType,
      token,
      forceUpload,
      accept
    }: IQiniuUpload,
    ref: any
  ) => {
    const { qiniu } = useSelector((state: IState) => state.user.info);
    const [forceToken, setForceToken] = useState("");

    const handleBeforeUpload = useCallback(
      async (file: RcFile, FileList: RcFile[]) => {
        // 获取强制上传token
        if (forceUpload && path) {
          const res = await getForceUploadToken(path);
          res.data.type === "success" && setForceToken(res.data.token);
        }
        // 如果有自定义beforeUpload,则执行
        if (beforeUpload) {
          const res = beforeUpload(file, FileList);
          if (!res) {
            // async/await中执行reject的写法.
            throw new Error("停止上传！");
          }
        }
      },
      [beforeUpload, forceUpload, path]
    );

    return (
      <Upload
        ref={ref}
        className={className}
        listType={listType}
        accept={accept || "image/*"}
        showUploadList={false}
        action={QINIU_SERVER}
        beforeUpload={handleBeforeUpload}
        onChange={onChange}
        data={{
          token: forceToken || token || (qiniu && qiniu.token),
          key: path
        }}
      >
        {children}
      </Upload>
    );
  }
);

export default QiniuUpload;
