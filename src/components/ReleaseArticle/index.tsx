import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo
} from "react";
import { FormComponentProps } from "antd/lib/form";
import { Form, Input, Icon, Button, message, Select } from "antd";
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
  searchMusic,
  getSongUrl,
  updateAraftSong
} from "@/api";
import {
  UploadFile,
  UploadChangeParam,
  RcFile
} from "antd/lib/upload/interface";
import { LabeledValue } from "antd/lib/select";
import { debounce } from "lodash";
import ObjectId from "bson-objectid";
import "braft-editor/dist/index.css";
import "./index.scss";

interface IReleaseArticleProps extends FormComponentProps {
  type?: "read" | "music" | "movie" | "fm";
  children?: React.ReactChild;
}

let timer: any = null;

const ReleaseArticle = Form.create<IReleaseArticleProps>()(
  ({
    form: { getFieldDecorator, getFieldValue, getFieldsValue, setFieldsValue },
    type = "read"
  }: IReleaseArticleProps) => {
    const [articleId, setArticleId] = useState(ObjectId().toString());
    const [cover, setCover] = useState<string | undefined>();
    // 上传的文件名（路径），beforeUpload获取。
    const [filePathTemp, setFilePathTemp] = useState("");
    // file的uid作为key
    const [filePath, setFilePath] = useState<{ [propName: string]: string }>(
      {}
    );
    // 发布中...
    const [releaseLoading, setReleaseLoading] = useState(false);
    const [uploadAudioLoading, setUploadAudioLoading] = useState(false);
    // 焦点是否在编辑区（包含标题和概述）
    const [focus, setFocus] = useState(true);
    const [selectPlaceholder, setSelectPlaceholder] = useState("搜索音乐！");
    // 搜索歌曲列表
    const [songs, setSongs] = useState([]);
    // 草稿箱中的音乐ID
    const [musicId, setMusicId] = useState();
    const [audioUrl, setAudioUrl] = useState("");
    const editorRef = useRef();

    // init
    useEffect(() => {
      (async () => {
        const res = await getAraft(type);
        if (res.data.type === "success") {
          const araft = res.data.araft;
          const music = res.data.music;
          setCover(araft.cover);
          setArticleId(araft._id);
          setFieldsValue({
            title: araft.title,
            summary: araft.summary,
            content: BraftEditor.createEditorState(araft.content)
          });
          if (music) {
            setAudioUrl(`${QINIU_CLIENT}/music/${araft.music_id}.mp3`);
            setSelectPlaceholder(`${music.name} - ${music.singers}`);
            setMusicId(araft.music_id);
          }
          if (type === "fm" && araft.fmUrl) {
            setAudioUrl(`${QINIU_CLIENT}/${araft.fmUrl}`);
          }
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 拼接数据
    const handleGetDate = useCallback(() => {
      const { title, content, summary, music } = getFieldsValue();
      let html = content && content.toHTML();
      html = /^(<p><\/p>)*?$/.test(html) ? undefined : html;
      const music_id = (music && music.key) || musicId;
      const fmUrl =
        type === "fm" && audioUrl
          ? audioUrl.split(QINIU_CLIENT + "/")[1]
          : undefined;
      const data: any = {
        _id: articleId,
        type,
        cover,
        fmUrl,
        music_id,
        content: html,
        summary: summary && summary.trim(),
        title: title && title.trim()
      };
      return data;
    }, [cover, getFieldsValue, articleId, type, musicId, audioUrl]);

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

    // 手动更新最新的数据到数据库
    const updateLastData = useCallback(() => {
      setFocus(true);
      setFocus(false);
    }, []);

    // 清空编辑区
    const clear = useCallback(async () => {
      const res = await clearAraft(articleId);
      if (res.data.type === "success") {
        setFocus(true);
        setFieldsValue({
          title: undefined,
          summary: undefined,
          music: undefined,
          content: BraftEditor.createEditorState(null)
        });
        cover && qiniuDelete(cover);
        setCover(undefined);
        setMusicId(undefined);
        setAudioUrl("");
        setSongs([]);
        setSelectPlaceholder("搜索音乐！");
        setArticleId(ObjectId().toString());
        return true;
      } else {
        message.error("删除草稿箱失败！");
        return false;
      }
    }, [cover, setFieldsValue, articleId]);

    // 发布文章
    const handleRelease = useCallback(async () => {
      if (!cover) {
        message.error("请上传封面！");
        return;
      }
      // 点击发布按钮时,取消焦点离开导致的保存草稿操作(都发布了,还草稿个毛线)
      setFocus(true);
      setReleaseLoading(true);
      // 发布
      const res = await writeArticle(handleGetDate());
      if (res.data.type === "success") {
        clear();
        message.success("发布成功!");
      }
      setReleaseLoading(false);
    }, [handleGetDate, clear, cover]);

    // 手动执行清理
    const handleClear = useCallback(async () => {
      setFocus(true);
      if (await clear()) {
        message.success("清理草稿箱成功！");
      }
    }, [clear]);

    // 文件上传前获取文件信息，拼接路径并暂存
    const handleBeforeUpload = useCallback(
      (file: RcFile) => {
        const key = `article/${articleId}/${file.lastModified}/${file.name}`;
        setFilePath(preState => ({ ...preState, [file.uid]: key }));
        setFilePathTemp(key);
        return true;
      },
      [articleId]
    );

    // 图片上传完成后编辑器获取图片
    const handleInsertImage = useCallback(
      ({ file: { uid, status } }: UploadChangeParam<UploadFile<any>>) => {
        if (status === "done") {
          // @ts-ignore 插入图片时需要获取富文本的焦点，否则会报错
          editorRef.current.focus && editorRef.current.focus();
          setFieldsValue({
            content: ContentUtils.insertMedias(getFieldValue("content"), [
              {
                type: "IMAGE",
                url: QINIU_CLIENT + "/" + filePath[uid]
              }
            ])
          });
        }
      },
      [getFieldValue, setFieldsValue, filePath]
    );

    // FM文件上传完后的回调
    const handleFmUploaded = useCallback(
      ({ file: { uid, status } }: UploadChangeParam<UploadFile<any>>) => {
        if (status === "uploading") {
          setUploadAudioLoading(true);
        }
        if (status === "done") {
          setUploadAudioLoading(false);
          setAudioUrl(QINIU_CLIENT + "/" + filePath[uid]);
          updateLastData();
        }
      },
      [filePath, updateLastData]
    );

    // 封面上传回调
    const handleCoverUploaded = useCallback(
      ({ file: { uid, status } }: UploadChangeParam<UploadFile<any>>) => {
        if (status === "success" || status === "done") {
          cover && qiniuDelete(cover);
          setCover(filePath[uid]);
          updateLastData();
        }
      },
      [filePath, cover, updateLastData]
    );

    // 搜索歌曲
    const handleSearch = useCallback(
      debounce(async (value: string) => {
        if (value) {
          const res = await searchMusic(value);
          if (res.status === 200) {
            setSongs(res.data.result.songs);
          } else {
            setSongs([]);
          }
        }
      }, 500),
      []
    );

    // 选择搜索歌曲的回调
    const handleSelectMusic = useCallback(
      async (value: string | number | LabeledValue) => {
        const key = (value as LabeledValue).key;
        const info = (value as LabeledValue).label;
        const res = await getSongUrl(key);
        if (res.status === 200) {
          const songUrl =
            res.data &&
            res.data.data &&
            res.data.data[0] &&
            res.data.data[0].url;
          if (songUrl) {
            setAudioUrl(songUrl);
            setSelectPlaceholder(info as string);
            updateAraftSong(key, songUrl);
            updateLastData();
          } else {
            message.warn("获取歌曲失败！");
          }
        }
      },
      [updateLastData]
    );

    const onFocus = useCallback(() => setFocus(true), []);
    const onBlur = useCallback(() => setFocus(false), []);

    // 歌曲选项列表
    const selectOptions = useMemo(
      () =>
        songs &&
        songs.map(({ id, name, artists }: any) => (
          <Select.Option key={id}>{`${name} - ${artists.reduce(
            (sum: string, cur: any) => `${sum ? sum + "," : ""}${cur.name}`,
            ""
          )}`}</Select.Option>
        )),
      [songs]
    );

    // 表单布局
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
            })(
              <Input
                placeholder="请输入标题！"
                onBlur={onBlur}
                onFocus={onFocus}
              />
            )}
          </Form.Item>
          <Form.Item label="摘要">
            {getFieldDecorator("summary", {
              rules: [{ required: true, message: "请输入摘要！" }]
            })(
              <Input
                placeholder="请输入摘要！"
                onBlur={onBlur}
                onFocus={onFocus}
              />
            )}
          </Form.Item>
          {type === "music" && (
            <Form.Item label="歌曲">
              {getFieldDecorator("music", {
                rules: [{ required: true, message: "请选择音乐！" }]
              })(
                <Select
                  showSearch
                  labelInValue={true}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  placeholder={selectPlaceholder}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onSelect={handleSelectMusic}
                  onSearch={handleSearch}
                  notFoundContent={null}
                >
                  {selectOptions}
                </Select>
              )}
            </Form.Item>
          )}
          {type === "fm" && (
            <Form.Item label="音频">
              <QiniuUpload
                accept="audio/*"
                beforeUpload={handleBeforeUpload}
                onChange={handleFmUploaded}
                path={filePathTemp}
              >
                <Button loading={uploadAudioLoading}>上传FM音频</Button>
              </QiniuUpload>
            </Form.Item>
          )}
          {audioUrl && (
            <Form.Item label="播放器">
              <audio src={audioUrl} controls>
                您的浏览器不支持播放！
              </audio>
            </Form.Item>
          )}
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
                        path={filePathTemp}
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
              path={filePathTemp}
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

export default ReleaseArticle;
