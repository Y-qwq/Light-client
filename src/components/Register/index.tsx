import React, { useState, useCallback } from "react";
import { useHistory } from "react-router";
import { message } from "antd";
import LongButton from "@/commom/LongButton";
import MyInput from "@/commom/MyInput";
import { userRegister } from "@/api";
import "./index.scss";

const Register = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegisterClick = useCallback(() => {
    const register = async () => {
      const res = await userRegister(username, email, password);
      console.dir(res);
      if (res.status === 200) {
        res.data && message.success(res.data.message, 1.5);
        history.push("/user/loginRegister/login");
      } else if (res.status === 400) {
        setEmail("");
        setPassword("");
      }
    };
    register();
  }, [username, email, password, history]);

  return (
    <div className="register">
      <MyInput
        name="昵称"
        placeholder="请输入昵称"
        className="register-input"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
      <MyInput
        name="邮箱"
        placeholder="请输入邮箱"
        className="register-input"
        value={email}
        onChange={({ target }) => setEmail(target.value)}
      />
      <MyInput
        name="密码"
        placeholder="请输入密码"
        className="register-input"
        type="password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
      <LongButton
        text="注册"
        action={
          username &&
          password &&
          /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(email)
        }
        onClick={handleRegisterClick}
      />
    </div>
  );
};

export default Register;
