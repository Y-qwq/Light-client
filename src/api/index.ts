import axios from "axios";
import { message } from "antd";

axios.defaults.baseURL = "http://127.0.0.1";
axios.interceptors.response.use(
  response => response,
  error => {
    // 服务器主动返回的错误,则继续往下传递
    if (error.response && error.response.data && error.response.data.message) {
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

export const QINIU_SERVER = "https://upload-z2.qiniup.com"; // 根据存储区域修改上传域名
export const QINIU_CLIENT = "http://q1f9rvxhs.bkt.clouddn.com"; // 图片地址

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

export default { GET, POST };
