import React, { useState, useCallback } from "react";
import { QINIU_CLIENT, changeUserAuth, changeUserBanned } from "@/api";
import { Table, Avatar, Tag, Input, Button, Icon } from "antd";
import useFetchUserList from "@/hooks/useFetchUserList";
import AddAccountModal from "@/components/AddAccountModal";
import AsyncSwitch from "@/common/AsyncSwitch";
import Highlighter from "react-highlight-words";
import { IDataUser } from "@/redux/reducers";
import { ColumnProps } from "antd/es/table";
import SelectTap, {
  ISelectTagData,
  ISelectTagOnSelect
} from "@/common/SelectTap";

const authTapData: ISelectTagData = [
  { name: "用户", color: "blue", key: 1 },
  { name: "作者", color: "purple", key: 2 },
  { name: "管理员", color: "magenta", key: 3 }
];

const PAGE_SIZE = 7;

const TotalUserManage: React.SFC = () => {
  const [userList, updateUserList] = useFetchUserList();
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const [ModalVisible, setModalVisible] = useState(false);

  const handleSelectTag = useCallback(
    async ({ key }: ISelectTagOnSelect, _id: string) => {
      const res = await changeUserAuth(_id, +key + 1);
      if (res.data.type === "success") {
        updateUserList();
      }
    },
    [updateUserList]
  );

  const handleBannedClick = useCallback(
    async (_id: string, key: number) => {
      const res = await changeUserBanned(_id, key ? 0 : 1);
      if (res.data.type === "success") {
        await updateUserList();
      }
    },
    [updateUserList]
  );

  const handleSearch = useCallback(
    (
      selectedKeys: React.ReactText[] | undefined,
      confirm: Function | undefined,
      dataIndex: string
    ) => {
      confirm && confirm();
      selectedKeys && setSearchText("" + selectedKeys[0]);
      setSearchedColumn(dataIndex);
    },
    []
  );

  const handleReset = useCallback((clearFilters: Function | undefined) => {
    clearFilters && clearFilters();
    setSearchText("");
  }, []);

  const getColumnSearchProps: (
    dataIndex: string
  ) => ColumnProps<IDataUser> = useCallback(
    (dataIndex: string) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys && selectedKeys[0]}
            onChange={e =>
              setSelectedKeys &&
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
        </div>
      ),
      filterIcon: filtered => (
        <Icon
          type="search"
          style={{ color: filtered ? "#1890ff" : undefined }}
        />
      ),
      onFilter: (value, record: IDataUser) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      render: (text: string) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text}
          />
        ) : (
          text
        )
    }),
    [handleReset, handleSearch, searchText, searchedColumn]
  );

  const columns: ColumnProps<IDataUser>[] = [
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      width: "5%",
      render: (hash: string, { _id, auth }: { _id: string; auth: number }) =>
        hash ? (
          <Avatar src={`${QINIU_CLIENT}/avatar/${_id}?h=${hash}`} />
        ) : (
          <Avatar style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}>
            {auth <= 1 ? "U" : "A"}
          </Avatar>
        )
    },
    {
      title: "用户名",
      dataIndex: "username",
      width: "10%",
      ellipsis: true,
      ...getColumnSearchProps("username")
    },
    {
      title: "邮箱",
      dataIndex: "email",
      width: "15%",
      ellipsis: true,
      ...getColumnSearchProps("email")
    },
    {
      title: "权限",
      dataIndex: "auth",
      width: "7%",
      filters: [
        { text: "管理员", value: "3" },
        { text: "作者", value: "2" },
        { text: "用户", value: "1" }
      ],
      onFilter: (value: string, data: IDataUser) => data.auth === +value,
      render: (auth: number, { _id }: IDataUser) => (
        <SelectTap
          current={auth}
          data={authTapData}
          onSelect={p => handleSelectTag(p, _id)}
        />
      )
    },
    {
      title: "最后登录IP",
      dataIndex: "lastLoginIp",
      width: "10%",
      ...getColumnSearchProps("lastLoginIp")
    },
    {
      title: "最后登录地址",
      dataIndex: "lastLoginAddress",
      ...getColumnSearchProps("lastLoginAddress")
    },
    {
      title: "最后登录时间",
      dataIndex: "lastLoginDate",
      sorter: (a: IDataUser, b: IDataUser) =>
        +new Date(a.lastLoginDate) - +new Date(b.lastLoginDate),
      sortDirections: ["descend", "ascend"],
      render: (timestamp: string | undefined) =>
        timestamp && new Date(timestamp).toLocaleString()
    },
    {
      title: "创建时间",
      dataIndex: "created",
      width: "9%",
      sorter: (a: IDataUser, b: IDataUser) =>
        +new Date(a.created) - +new Date(b.created),
      sortDirections: ["descend", "ascend"],
      render: (timestamp: string) => new Date(timestamp).toLocaleDateString()
    },
    {
      title: "激活状态",
      dataIndex: "activation",
      width: "9%",
      filters: [
        { text: "激活", value: "1" },
        { text: "未激活", value: "0" }
      ],
      filterMultiple: false,
      onFilter: (value: string, data: IDataUser) => data.activation === +value,
      render: (activation: number) => (
        <Tag color={activation === 1 ? "green" : "red"}>
          {activation === 1 ? "激活" : "未激活"}
        </Tag>
      )
    },
    {
      title: "是否有效",
      dataIndex: "banned",
      width: "9%",
      filters: [
        { text: "封禁", value: "1" },
        { text: "未封禁", value: "0" }
      ],
      onFilter: (value: string, data: IDataUser) => data.banned === +value,
      filterMultiple: false,
      render: (banned: number, { _id }: IDataUser) => (
        <AsyncSwitch
          checked={!banned}
          onClick={() => handleBannedClick(_id, banned)}
        />
      )
    }
  ];

  return (
    <>
      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => setModalVisible(true)}
      >
        添加管理员账号
      </Button>
      <AddAccountModal
        visible={ModalVisible}
        onCancel={() => setModalVisible(false)}
        onUpdate={updateUserList}
      />
      {userList && (
        <Table
          columns={columns}
          dataSource={userList}
          pagination={{ pageSize: PAGE_SIZE, hideOnSinglePage: true }}
          rowKey="_id"
        />
      )}
    </>
  );
};

export default TotalUserManage;
