import React, { useCallback } from "react";
import { Layout, Menu, Icon, Avatar, Dropdown } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import "./index.scss";

const { Header, Content, Sider } = Layout;

const ConsolePanel: React.SFC = () => {
  const handleLoginOut = useCallback(() => {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("adminToken");
  }, []);

  const userMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/admin/changeInfo">修改个人信息</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/admin/login" onClick={handleLoginOut}>
          退出
        </Link>
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout className="console-panel">
      <Sider breakpoint="lg" collapsible={true} theme={"light"}>
        <p className="console-panel-logo">Light</p>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          className="console-panel-menu"
        >
          <Menu.Item key="1">
            <Icon type="line-chart" />
            <span className="nav-text">首页</span>
          </Menu.Item>
          <Menu.SubMenu
            key="2"
            title={
              <span>
                <Icon type="user" />
                <span className="nav-text">用户管理</span>
              </span>
            }
          >
            <Menu.Item key="2-1">Option 1</Menu.Item>
            <Menu.Item key="2-2">Option 2</Menu.Item>
            <Menu.Item key="2-3">Option 3</Menu.Item>
            <Menu.Item key="2-4">Option 4</Menu.Item>
            <Menu.Item key="2-5">Option 5</Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="3"
            title={
              <span>
                <Icon type="file-text" />
                <span className="nav-text">文章管理</span>
              </span>
            }
          >
            <Menu.Item key="3-1">Option 1</Menu.Item>
            <Menu.Item key="3-2">Option 2</Menu.Item>
            <Menu.Item key="3-3">Option 3</Menu.Item>
            <Menu.Item key="3-4">Option 4</Menu.Item>
            <Menu.Item key="3-5">Option 5</Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="4">
            <Icon type="setting" />
            <span className="nav-text">系统管理</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="console-panel-head">
          <div className="user-info-box">
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className="user-info">
                <Avatar
                  style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                >
                  A
                </Avatar>
                {`  叶梓军 `}
                <Icon type="down" />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="console-panel-content-box">
          <div className="console-panel-content">content</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ConsolePanel;
