import React, { useCallback, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { RouteConfigComponentProps } from "react-router-config";
import { musicLogin, updateMusicAccount } from "@/api";
import { useSelector } from "react-redux";
import { IState } from "@/redux/reducers";
import "./index.scss";

interface ISystemManageProps
  extends FormComponentProps,
    RouteConfigComponentProps {}

const SystemManage = Form.create<ISystemManageProps>()(
  ({
    form: { getFieldDecorator, getFieldsValue, setFieldsValue }
  }: FormComponentProps) => {
    const { music_account, music_password } = useSelector(
      (state: IState) => state.user.info
    );

    useEffect(() => {
      setFieldsValue({
        account: music_account,
        password: music_password
      });
    }, [setFieldsValue, music_account, music_password]);

    const handleSave = useCallback(async () => {
      const { account, password } = getFieldsValue();
      if (!account || !password) {
        message.error(`请输入${account ? "密码" : "账户"}！`);
        return;
      }
      try {
        await musicLogin(account, password);
        const saveRes = await updateMusicAccount(account, password);
        if (saveRes.status === 200 && saveRes.data.type === "success") {
          console.log("保存网易云账户成功！");
        }
      } catch (error) {
        message.error("账户或者密码错误！");
      }
    }, [getFieldsValue]);

    return (
      <Form className="system-manage-form">
        <h2>网易云登录</h2>
        <p>
          音乐文章的歌曲源自网易云，您可以在此保存网易云账户密码，系统会自动登录您的账户以获得更完整的曲库！
        </p>
        <Form.Item label="网易云账户">
          {getFieldDecorator("account", {
            rules: [{ required: true, message: "请输入邮箱或者手机号！" }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="网易云密码">
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "请输入密码！" }]
          })(<Input type="password" />)}
        </Form.Item>
        <Button onClick={handleSave}>保存账户</Button>
      </Form>
    );
  }
);

export default SystemManage;
