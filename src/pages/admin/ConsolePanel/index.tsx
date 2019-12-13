import React, { useCallback, useMemo, Suspense } from "react";
import { RouteConfigComponentProps } from "react-router-config";
import { Layout, Menu, Icon, Avatar, Dropdown } from "antd";
import { Link, useHistory } from "react-router-dom";
import renderRoutes from "@/router/renderRoutes";
import { useSelector } from "react-redux";
import { IState } from "@/redux/reducers";
import Loading from "@/commom/Loading";
import { QINIU_CLIENT } from "@/api";
import axios from "axios";
import "./index.scss";

const { Header, Content, Sider } = Layout;

interface IMenu {
  key: string;
  content: React.ReactNode;
  childents?: IMenuList;
}

interface IMenuList {
  [index: number]:
    | IMenu
    | {
        key: string;
        content: React.ReactNode;
        childents: IMenu[];
      }
    | {
        key: string;
        content: React.ReactNode;
        childents: {
          key: string;
          content: React.ReactNode;
          childents: IMenu[];
        }[];
      };
  [propName: string]: any;
}

const menuList: IMenuList = [
  {
    key: "1",
    content: (
      <>
        <Icon type="line-chart" />
        <span className="nav-text">首页</span>
      </>
    )
  },
  {
    key: "2",
    content: (
      <>
        <Icon type="user" />
        <span className="nav-text">用户管理</span>
      </>
    )
  },
  {
    key: "3",
    content: (
      <>
        <Icon type="file-text" />
        <span className="nav-text">文章管理</span>
      </>
    ),
    childents: [
      {
        key: "3-1",
        content: <span className="nav-text">阅读文章管理</span>,
        childents: [
          { key: "3-1-1", content: "文章发布" },
          { key: "3-1-2", content: "阅读列表" }
        ]
      },
      {
        key: "3-2",
        content: <span className="nav-text">音乐文章管理</span>,
        childents: [
          { key: "3-2-1", content: "文章发布" },
          { key: "3-2-2", content: "音乐列表" }
        ]
      },
      {
        key: "3-3",
        content: <span className="nav-text">影视文章管理</span>,
        childents: [
          { key: "3-3-1", content: "文章发布" },
          { key: "3-3-2", content: "影视列表" }
        ]
      },
      {
        key: "3-4",
        content: <span className="nav-text">电台文章管理</span>,
        childents: [
          { key: "3-4-1", content: "文章发布" },
          { key: "3-4-2", content: "电台列表" }
        ]
      }
    ]
  },
  {
    key: "4",
    content: (
      <>
        <Icon type="setting" />
        <span className="nav-text">系统管理</span>
      </>
    )
  }
];

const ConsolePanel = ({ route }: RouteConfigComponentProps) => {
  const history = useHistory();
  const user = useSelector((state: IState) => state.user.info);

  const handleLoginOut = useCallback(() => {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("adminToken");
  }, []);

  const menuListMap = useCallback(
    (menus: IMenuList) =>
      menus.map((menu: IMenu) => {
        if (!menu.childents) {
          return <Menu.Item key={menu.key}>{menu.content}</Menu.Item>;
        } else {
          return (
            <Menu.SubMenu key={menu.key} title={menu.content}>
              {menuListMap(menu.childents)}
            </Menu.SubMenu>
          );
        }
      }),
    []
  );

  const handleItemClick = useCallback(
    ({ key }) => {
      switch (key) {
        case "1":
          history.push("/admin/consolePanel");
          break;
        case "2":
          history.push("/admin/consolePanel/userManage");
          break;
        case "3-1-1":
          history.push("/admin/consolePanel/releaseReadArticle");
          break;
        case "3-1-2":
          history.push("/admin/consolePanel/list/read");
          break;
        case "3-2-1":
          history.push("/admin/consolePanel/releaseMusicArticle");
          break;
        case "3-2-2":
          history.push("/admin/consolePanel/list/music");
          break;
        case "3-3-1":
          history.push("/admin/consolePanel/releaseMovieArticle");
          break;
        case "3-3-2":
          history.push("/admin/consolePanel/list/movie");
          break;
        case "3-4-1":
          history.push("/admin/consolePanel/releaseFmArticle");
          break;
        case "3-4-2":
          history.push("/admin/consolePanel/list/fm");
          break;
        case "4":
          history.push("/admin/consolePanel/SystemManage");
          break;
      }
    },
    [history]
  );

  // 右上角个人信息选项
  const userMenu = useMemo(
    () => (
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
    ),
    [handleLoginOut]
  );

  // 右上角个人信息
  const userInfo = useMemo(
    () => (
      <div className="user-info-box">
        <Dropdown overlay={userMenu} placement="bottomRight">
          <div className="user-info">
            <Avatar
              src={`${QINIU_CLIENT}/avatar/${user._id}?h=${user.avatar}`}
              style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
            >
              A
            </Avatar>
            {`  ${user.username} `}
            <Icon type="down" />
          </div>
        </Dropdown>
      </div>
    ),
    [user.avatar, user.username, user._id, userMenu]
  );

  return (
    <Layout className="console-panel">
      <Sider breakpoint="lg" collapsible={true} theme={"light"}>
        <p className="console-panel-logo">Light</p>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          className="console-panel-menu"
          onClick={handleItemClick}
        >
          {menuListMap(menuList)}
        </Menu>
      </Sider>
      <Layout>
        <Header className="console-panel-head">{userInfo}</Header>
        <Content className="console-panel-content-box">
          <div className="console-panel-content">
            <Suspense fallback={<Loading />}>
              {route && renderRoutes(route.routes, route.authed)}
            </Suspense>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ConsolePanel;
