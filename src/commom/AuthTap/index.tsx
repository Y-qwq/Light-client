import React, { useCallback } from "react";
import { Tag, Dropdown, Menu } from "antd";
import { ClickParam } from "antd/lib/menu";
import { changeUserAuth } from "@/api";
import useFetchUserList from "@/hooks/useFetchUserList";

interface IAuthTapProps {
  auth: number;
  _id: string;
}

const AuthTap = ({ auth, _id }: IAuthTapProps) => {
  const [, updateUserList] = useFetchUserList();

  const handleClick = useCallback(
    async ({ key }: ClickParam) => {
      const res = await changeUserAuth(_id, +key);
      if (res.data.type === "success") {
        updateUserList();
      }
    },
    [_id, updateUserList]
  );

  const user = (
    <Tag color="blue" style={{ marginRight: 0 }}>
      用户
    </Tag>
  );
  const author = (
    <Tag color="purple" style={{ marginRight: 0 }}>
      作者
    </Tag>
  );
  const adminer = (
    <Tag color="magenta" style={{ marginRight: 0 }}>
      管理员
    </Tag>
  );

  const menu = (
    <Menu onClick={handleClick}>
      <Menu.Item key={1}>{user}</Menu.Item>
      <Menu.Divider />
      <Menu.Item key={2}>{author}</Menu.Item>
      <Menu.Divider />
      <Menu.Item key={3}>{adminer}</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      {auth === 1 ? user : auth === 2 ? author : adminer}
    </Dropdown>
  );
};

export default AuthTap;
