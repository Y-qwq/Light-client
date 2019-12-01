import React, { useCallback, useEffect, useMemo } from "react";
import { RouteConfigComponentProps } from "react-router-config";
import { Icon, Form, Input, Button, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import UploadAvatar from "@/components/UploadAvatar";
import { FormComponentProps } from "antd/lib/form";
import { loginAction } from "@/redux/action";
import { useHistory } from "react-router";
import { IState } from "@/redux/reducers";
import { updateUserInfo } from "@/api";
import "./index.scss";

interface IChangeInfoProps
  extends RouteConfigComponentProps,
    FormComponentProps {}

const { Item } = Form;

const ChangeInfo = Form.create<IChangeInfoProps>()(
  (props: IChangeInfoProps) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector((state: IState) => state.user.info);
    const { getFieldDecorator, setFieldsValue, getFieldsValue } = props.form;

    useEffect(() => {
      const { username, email, introduction, avatar } = user;
      setFieldsValue({ username, email, introduction, avatar });
    }, [setFieldsValue, user]);

    const verifyPassword = useCallback(
      (_rule: string, value: string, cb: Function) => {
        if (!/^\w*$/.test(value)) {
          cb("密码必须为字母、数字或者下划线！");
        } else {
          cb();
        }
      },
      []
    );

    const handleSubmit = useCallback(async () => {
      const data = getFieldsValue();
      const res = await updateUserInfo(data);
      if (res.data.type === "success") {
        message.success("修改信息成功！");
        delete data.password;
        const info = { ...user, ...data };
        dispatch(loginAction.setUserInfo(info));
        setTimeout(() => {
          history.push("/admin/consolePanel");
        }, 600);
      } else {
        message.error("修改信息失败！");
      }
    }, [getFieldsValue, history, dispatch, user]);

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };

    const goBack = useMemo(
      () => (
        <Icon
          type="left"
          className="change-info-goback"
          onClick={() => history.goBack()}
        />
      ),
      [history]
    );

    return (
      <div className="change-info">
        {goBack}
        <h1 className="change-info-title">修改个人信息</h1>
        <div className="change-info-content">
          <Form className="info" {...formItemLayout}>
            <Item label="头像">
              {getFieldDecorator("avatar")(
                <UploadAvatar _id={user._id} name="A" />
              )}
            </Item>
            <Item label="用户名">
              {getFieldDecorator("username", {
                rules: [{ required: true, message: "用户名不能为空！" }]
              })(<Input />)}
            </Item>
            <Item label="密码" hasFeedback>
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: false,
                    validator: verifyPassword
                  }
                ]
              })(
                <Input
                  type="password"
                  placeholder="若需要改密码，请输入新的密码！"
                />
              )}
            </Item>
            <Item label="Email">
              {getFieldDecorator("email")(<Input disabled />)}
            </Item>
            <Item label="个人介绍">
              {getFieldDecorator("introduction")(
                <Input.TextArea
                  rows={4}
                  placeholder="这个人很懒，什么也没留下~"
                />
              )}
              <Button
                type="primary"
                htmlType="submit"
                className="change-info-submit"
                onClick={handleSubmit}
              >
                确认修改
              </Button>
            </Item>
          </Form>
        </div>
      </div>
    );
  }
);

export default ChangeInfo;
