import axios, { AxiosInstance } from "axios";
import checkMobile from "@/util/checkMobile";
import debounce from "lodash.debounce";
import { message } from "antd";

const HOST = "http://39.108.180.34";

axios.defaults.baseURL = `${HOST}:5000`;

export const QINIU_SERVER = "https://upload-z2.qiniup.com"; // 存储区域上传域名

export const QINIU_CLIENT = "http://yzj.ningxiaojian.top"; // 图片根地址

const gotoLogin = debounce(
  () => {
    message.error("未登录或登录凭证过期，请重新登录！");
    window.location.href = checkMobile()
      ? "/user/loginRegister/login"
      : "/admin/login";
  },
  1000,
  { leading: true, trailing: false }
);

axios.interceptors.response.use(
  response => response,
  error => {
    // 服务器主动返回的错误,则继续往下传递
    if (error.response && error.response.data && error.response.data.message) {
      if (error.response.status === 401) {
        gotoLogin();
        Promise.reject(error);
        return error.response;
      }
      message.error(error.response.data.message, 0.8);
      return error.response;
    } else {
      // 否则拦截错误，并提示错误。
      console.dir(error);
      error && error.message && message.error(error.message);
      return Promise.reject(error);
    }
  }
);

const GET = (url: string, params?: {}) => axios.get("/api" + url, { params });
const POST = (url: string, params?: {}) => axios.post("/api" + url, params);

export const checkToken = () => GET("/login/checkToken");

export const checkAdminToken = () => GET("/login/checkAdminToken");

export const checkEmail = (email: string) =>
  GET("/login/checkEmail", { email });

export const userLogin = (email: string, password: string) =>
  POST("/login/userLogin", { email, password });

export const adminLogin = (email: string, password: string) =>
  POST("/login/adminLogin", { email, password });

export const userRegister = (
  username: string,
  email: string,
  password: string
) => POST("/login/userRegister", { username, email, password });

export const adminRegister = (
  username: string,
  email: string,
  password: string
) => POST("/login/adminRegister", { username, email, password });

export const forgetPassword = (email: string) =>
  POST("/login/forgetPassword", { email });

export const resetPassword = (email: string, password: string, code: string) =>
  POST("/login/resetPassword", { email, password, code });

export const getForceUploadToken = (key: string) =>
  POST("/user/getForceUptoken", { key });

export const updateUserInfo = (info: {}) => POST("/user/updateInfo", info);

export const updateUserAvatar = (avatar: string) =>
  POST("/user/updateAvatar", { avatar });

export const getAllUser = () => GET("/user/getAllUser");

export const changeUserBanned = (_id: string, banned: number) =>
  POST("/user/changeBanned", { _id, banned });

export const changeUserAuth = (_id: string, auth: number) =>
  POST("/user/changeAuth", { _id, auth });

export const addAccount = (
  username: string,
  password: string,
  email: string,
  auth: number
) => POST("/user/addAccount", { username, password, email, auth });

export const getAraft = (type: string) => GET("/article/getAraft", { type });

export const clearAraft = (_id: string) => POST("/article/clearAraft", { _id });

export const saveAraft = (data: {
  type: string;
  _id: string;
  title?: string;
  summary?: string;
  cover?: string;
  content?: string;
}) => POST("/article/saveAraft", data);

export const writeArticle = (data: {
  _id: string;
  type: string;
  title: string;
  summary: string;
  cover: string;
  content: string;
  [propName: string]: any;
}) => POST("/article/write", data);

export const updateAraftSong = (music_id: string, url: string) =>
  POST("/article/updateAraftSongUrl", { music_id, url });

const music: AxiosInstance = axios.create({ baseURL: `${HOST}:3000` });
export const searchMusic = (keywords: string) =>
  music.get("/search", {
    baseURL: `${HOST}:3000`,
    params: { keywords }
  });
export const getSongUrl = (id: string) =>
  music.get("/song/url", {
    baseURL: `${HOST}:3000`,
    params: { id, br: 128000 },
    withCredentials: true
  });
export const musicLogin = (account: string, password: string) => {
  if (!/@/.test(account)) {
    return music.get("/login/cellphone", {
      params: { phone: account, password },
      withCredentials: true
    });
  } else {
    return music.get("/login/email", {
      params: { email: account, password },
      withCredentials: true
    });
  }
};

export const updateMusicAccount = (
  music_account: string,
  music_password: string
) => POST("/user/updateMusicAccount", { music_account, music_password });

export const qiniuDelete = (key: string) => POST("/qiniu/delete", { key });
export const qiniuFetch = (url: string, key: string) =>
  POST("/qiniu/fetch", { url, key });

export const getArticleList = (
  type: "read" | "fm" | "music" | "movie" | "image" | "all" | "recommend",
  count: number,
  skip: number = 0,
  isUser?: boolean,
  sorterKey?: string,
  sorterMethod?: "descend" | "ascend"
) =>
  GET("/article/get", { type, count, skip, isUser, sorterKey, sorterMethod });

export const changeArticleBanned = (_id: string, banned: number) =>
  POST("/article/banned", { _id, banned });

export const changeArticlePass = (_id: string, pass: number) =>
  POST("/article/pass", { _id, pass });

export const changeArticleRecommend = (_id: string, recommend: number) =>
  POST("/article/recommend", { _id, recommend });

export const changeStarArticle = (
  _id: string,
  article_id: string,
  isAdd: 0 | 1
) => POST("/article/star", { _id, article_id, isAdd });

export const changeCollectArticle = (
  _id: string,
  article_id: string,
  isAdd: 0 | 1
) => POST("/article/collect", { _id, article_id, isAdd });

export const getArticleDetail = (_id: string) =>
  GET("/article/detail", { _id });

export const followUser = (my_id: string, user_id: string, isFollow: 0 | 1) =>
  POST("/user/follow", { my_id, user_id, isFollow });

export const commentArticle = (
  article_id: string,
  commentator_id: string,
  content: string,
  reply_id?: string
) =>
  POST("/article/comment", { article_id, commentator_id, content, reply_id });

export default { GET, POST };
