import React, { useState, useCallback, useRef, useEffect } from "react";
import { RouteConfigComponentProps } from "react-router-config";
import { FormComponentProps } from "antd/lib/form";
import { Form, Input, Icon, Button, message } from "antd";
import QiniuUpload from "@/commom/QiniuUpload";
import { ContentUtils } from "braft-utils";
import BraftEditor from "braft-editor";
import {
  QINIU_CLIENT,
  saveAraft,
  getAraft,
  writeArticle,
  clearAraft,
  qiniuDelete,
  updateAraftCover
} from "@/api";
import {
  UploadFile,
  UploadChangeParam,
  RcFile
} from "antd/lib/upload/interface";
import ObjectId from "bson-objectid";
import "braft-editor/dist/index.css";
import "./index.scss";

interface IReleaseReadArticleProps
  extends FormComponentProps,
    RouteConfigComponentProps {}

let timer: any = null;
const type = "read";

const ReleaseReadArticle = Form.create<IReleaseReadArticleProps>()(
  (props: IReleaseReadArticleProps) => {
    const {
      form: { getFieldDecorator, getFieldValue, getFieldsValue, setFieldsValue }
    } = props;
    const [articleKey, setArticleKey] = useState(ObjectId());
    const [cover, setCover] = useState<string | undefined>();

    // 上传的文件名（路径），beforeUpload获取。
    const [imagePathTemp, setImagePathTemp] = useState("");
    // file的uid作为key
    const [imagePath, setImagePath] = useState<{ [propName: string]: string }>(
      {}
    );
    // 发布中...
    const [releaseLoading, setReleaseLoading] = useState(false);
    // 焦点是否在编辑区（包含标题和概述）
    const [focus, setFocus] = useState(true);
    const editorRef = useRef();

    // init
    useEffect(() => {
      (async () => {
        const res = await getAraft(type);
        if (res.data.type === "success") {
          const araft = res.data.araft;
          if (araft.cover) {
            setCover(araft.cover);
          }
          setArticleKey(araft._id);
          setFieldsValue({
            title: araft.title,
            summary: araft.summary,
            content: BraftEditor.createEditorState(araft.content)
          });
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 拼接表单
    const handleGetDate = useCallback(() => {
      const { title, content, summary } = getFieldsValue();
      let html = content && content.toHTML();
      html = /^(<p><\/p>)*?$/.test(html) ? undefined : html;
      const data: any = {
        _id: articleKey,
        type,
        content: html,
        summary: summary && summary.trim(),
        title: title && title.trim()
      };
      if (cover) {
        data.cover = cover;
      }
      return data;
    }, [cover, getFieldsValue, articleKey]);

    // 保存草稿
    const handleSave = useCallback(async () => {
      const data = handleGetDate();
      if (!data.title && !data.content && !data.summary && !cover) {
        return;
      }
      const res = await saveAraft(data);
      if (res.data.type === "success") {
        console.log("Save draft automatically", data);
      }
    }, [handleGetDate, cover]);

    // 自动保存 焦点离开整个编辑区则触发保存事件
    useEffect(() => {
      clearTimeout(timer);
      if (!focus) {
        timer = setTimeout(() => {
          handleSave();
        }, 100);
      }
    }, [focus, handleSave]);

    const clear = useCallback(() => {
      setFocus(true);
      setFieldsValue({
        title: undefined,
        summary: undefined,
        content: BraftEditor.createEditorState(null)
      });
      cover && qiniuDelete(cover);
      setCover(undefined);
      setArticleKey(ObjectId());
    }, [cover, setFieldsValue]);

    const handleRelease = useCallback(async () => {
      if (!cover) {
        message.error("请上传封面！");
      }
      // 点击发布按钮时,取消焦点离开导致的保存草稿操作(都发布了,还草稿个毛线)
      setFocus(true);
      setReleaseLoading(true);
      // 发布
      const res = await writeArticle(handleGetDate());
      if (res.data.type === "success") {
        clear();
        message.success("发布成功!");
        setReleaseLoading(false);
      }
    }, [handleGetDate, clear, cover]);

    const handleClear = useCallback(async () => {
      setFocus(true);
      const res = await clearAraft(articleKey);
      if (res.data.type === "success") {
        clear();
        message.success(res.data.message);
      }
    }, [articleKey, clear]);

    // 文件上传前获取文件信息，拼接路径并暂存
    const handleBeforeUpload = useCallback(
      (file: RcFile) => {
        const key = `article/${articleKey}/${file.lastModified}/${file.name}`;
        setImagePath(preState => ({ ...preState, [file.uid]: key }));
        setImagePathTemp(key);
        return true;
      },
      [articleKey]
    );

    // 图片上传完成后编辑器获取图片
    const handleInsertImage = useCallback(
      ({ file: { uid, status } }: UploadChangeParam<UploadFile<any>>) => {
        if (status === "done") {
          // @ts-ignore 插入图片时需要获取富文本的焦点，否则会报错
          editorRef.current.focus();
          setFieldsValue({
            content: ContentUtils.insertMedias(getFieldValue("content"), [
              {
                type: "IMAGE",
                url: QINIU_CLIENT + "/" + imagePath[uid]
              }
            ])
          });
        }
      },
      [getFieldValue, setFieldsValue, imagePath]
    );

    // 封面上传回调
    const handleCoverUploaded = useCallback(
      ({ file: { uid, status } }: UploadChangeParam<UploadFile<any>>) => {
        if (status === "success" || status === "done") {
          if (cover) {
            qiniuDelete(cover);
          }
          setCover(imagePath[uid]);
          updateAraftCover(type, imagePath[uid]);
        }
      },
      [imagePath, cover]
    );

    const onFocus = useCallback(() => setFocus(true), []);
    const onBlur = useCallback(() => setFocus(false), []);

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        lg: { span: 2 },
        xl: { span: 1 }
      },
      wrapperCol: {
        xs: { span: 24 },
        lg: { span: 22 },
        xl: { span: 23 }
      }
    };
    return (
      <div className="release-read-article">
        <div className="button-box">
          <Button onClick={handleClear} style={{ marginRight: 10 }}>
            清除草稿
          </Button>
          <Button
            type="primary"
            loading={releaseLoading}
            onClick={handleRelease}
          >
            发布文章
          </Button>
        </div>
        <Form
          {...formItemLayout}
          labelAlign="left"
          className="release-read-article-form"
        >
          <Form.Item label="标题">
            {getFieldDecorator("title", {
              rules: [{ required: true, message: "请输入标题！" }]
            })(<Input onBlur={onBlur} onFocus={onFocus} />)}
          </Form.Item>
          <Form.Item label="摘要">
            {getFieldDecorator("summary", {
              rules: [{ required: true, message: "请输入摘要！" }]
            })(<Input onBlur={onBlur} onFocus={onFocus} />)}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }}>
            {getFieldDecorator("content")(
              <BraftEditor
                draftProps={{ ref: editorRef }}
                className="editor"
                placeholder="请输入正文内容！"
                excludeControls={["headings", "media"]}
                onBlur={onBlur}
                onFocus={onFocus}
                extendControls={[
                  "separator",
                  {
                    key: "insert",
                    type: "component",
                    component: (
                      <QiniuUpload
                        beforeUpload={handleBeforeUpload}
                        onChange={handleInsertImage}
                        path={imagePathTemp}
                      >
                        <button
                          type="button"
                          className="control-item button upload-button"
                          data-title="插入图片"
                        >
                          <Icon type="picture" theme="filled" />
                        </button>
                      </QiniuUpload>
                    )
                  }
                ]}
              />
            )}
          </Form.Item>
          <Form.Item label="封面" required={true}>
            <QiniuUpload
              listType="picture"
              beforeUpload={handleBeforeUpload}
              path={imagePathTemp}
              onChange={handleCoverUploaded}
            >
              {cover ? (
                <img
                  src={`${QINIU_CLIENT}/${cover}`}
                  style={{ width: "100%" }}
                  alt="封面"
                />
              ) : (
                <Button loading={cover === "uploading"}>上传封面</Button>
              )}
            </QiniuUpload>
          </Form.Item>
        </Form>
      </div>
    );
  }
);

export default ReleaseReadArticle;
