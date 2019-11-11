import axios from "axios";
import { message } from "antd";

axios.defaults.baseURL = "http://127.0.0.1";
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.data && error.response.data.message) {
      message.error(error.response.data.message, 0.8);
    }
    return error.response;
  }
);

const GET = (url: string, params?: {}) => axios.get(url, { params });
const POST = (url: string, params?: {}) => axios.post(url, params);

export const checkToken = () => GET("/checkToken");
export const checkEmail = (email: string) => GET("/login/checkEmail", { email });

export const userLogin = (email: string, password: string) =>
  POST("/login/userLogin", { email, password });

export const userRegister = (username: string, email: string, password: string) =>
  POST("/login/userRegister", { username, email, password });

export const forgetPassword = (email: string) => POST("/login/forgetPassword", { email });
export const resetPassword = (email: string, password: string, code: string) =>
  POST("/login/resetPassword", { email, password, code });

export default { GET, POST };
