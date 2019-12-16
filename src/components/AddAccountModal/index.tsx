import React, { useState, useCallback } from "react";
import { Form, Input, Icon, Modal, Button, Radio } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { addAccount } from "@/api";
import "./index.scss";

interface IAddAccountModal extends FormComponentProps {
  onCancel: () => void;
  visible: boolean;
  onUpdate: Function;
}

const AddAccountModal = Form.create<IAddAccountModal>()(
  ({
    visible,
    onCancel,
    onUpdate,
    form: { getFieldDecorator, getFieldsValue }
  }: IAddAccountModal) => {
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleConfirm = useCallback(async () => {
      setConfirmLoading(true);
      const { username, password, email, auth } = getFieldsValue();
      const res = await addAccount(username, password, email, auth);
      if (res.data.type === "success") {
        onUpdate();
        setConfirmLoading(false);
        onCancel();
      }
    }, [getFieldsValue, onCancel, onUpdate]);

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

    const verifyEmail = useCallback(
      (_rule: string, value: string, cb: Function) => {
        if (
          !/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(
            value
          )
        ) {
          cb("请输入正确的邮箱格式！");
        } else {
          cb();
        }
      },
      []
    );

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };

    return (
      <Modal
        title="添加账户"
        visible={visible}
        onCancel={onCancel}
        footer={null}
        width={450}
      >
        <Form className="add-account-form" {...formItemLayout}>
          <Form.Item label="用户名">
            {getFieldDecorator("username", {
              rules: [{ required: true, message: "请输入用户名！" }]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="请输入用户名！"
              />
            )}
          </Form.Item>
          <Form.Item label="邮箱">
            {getFieldDecorator("email", {
              rules: [{ required: true, validator: verifyEmail }]
            })(
              <Input
                prefix={
                  <Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="请输入邮箱！"
              />
            )}
          </Form.Item>
          <Form.Item label="密码">
            {getFieldDecorator("password", {
              rules: [
                {
                  required: true,
                  validator: verifyPassword
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="请输入密码！"
              />
            )}
          </Form.Item>
          <Form.Item label="权限">
            {getFieldDecorator("auth", { initialValue: 1 })(
              <Radio.Group>
                <Radio value={1}>用户</Radio>
                <Radio value={2}>作者</Radio>
                <Radio value={3}>管理员</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Button
            type="primary"
            className="add-account-form-button"
            onClick={handleConfirm}
            loading={confirmLoading}
          >
            确认添加
          </Button>
        </Form>
      </Modal>
    );
  }
);

export default AddAccountModal;
