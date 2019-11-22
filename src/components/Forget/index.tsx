import React, { useState, useCallback } from "react";
import { RouteConfigComponentProps } from "react-router-config";
import { message } from "antd";
import { forgetPassword, resetPassword } from "@/api";
import useCheckEmail from "@/hooks/useCheckEmail";
import LongButton from "@/commom/LongButton";
import MyInput from "@/commom/MyInput";
import "./index.scss";

const Forget = ({ history }: RouteConfigComponentProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [resetPage, setResetPage] = useState(false);
  const hasEmail = useCheckEmail(email);

  const handleSendCode = useCallback(() => {
    const sendCode = async () => {
      const res = await forgetPassword(email);
      if (res.status === 200) {
        setResetPage(true);
      }
    };
    sendCode();
  }, [email]);

  const handleConfirmUpdate = useCallback(() => {
    const confirm = async () => {
      const res = await resetPassword(email, password, code);
      if (res.data && res.data.type === "success") {
        message.success(res.data.type);
        history.push("/user/loginRegister/login");
      } else {
        setCode("");
      }
    };
    confirm();
  }, [email, password, code, history]);

  const handleCheckPassword = useCallback(
    () => password !== confirmPassword && message.error("密码不匹配！"),
    [password, confirmPassword]
  );

  return (
    <div className="forget">
      {!resetPage && (
        <>
          <MyInput
            name="邮箱"
            placeholder="请输入邮箱"
            onChange={({ target }) => setEmail(target.value)}
          />
          <LongButton text="发送验证邮件" action={hasEmail} onClick={handleSendCode} />
        </>
      )}
      {resetPage && (
        <>
          <MyInput
            name="新密码"
            placeholder="请输入新密码"
            value={password}
            type="password"
            onChange={({ target }) => setPassword(target.value)}
          />
          <MyInput
            name="确认密码"
            placeholder="请再次输入密码"
            value={confirmPassword}
            type="password"
            onChange={({ target }) => setConfirmPassword(target.value)}
            onBlur={handleCheckPassword}
          />
          <MyInput
            name="验证码"
            placeholder="请输入验证码"
            value={code}
            onChange={({ target }) => setCode(target.value)}
          />
          <LongButton
            text="确认修改"
            action={password === confirmPassword && code.length >= 4}
            onClick={handleConfirmUpdate}
          />
        </>
      )}
    </div>
  );
};

export default Forget;
