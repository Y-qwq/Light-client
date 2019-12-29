import React, { useState, useCallback, useEffect } from "react";
import { RouteConfigComponentProps } from "react-router-config";
import SelectTap, { ISelectTagData } from "@/common/SelectTap";
import { SorterResult } from "antd/lib/table/interface";
import BannedSwitch from "@/common/BannedSwitch";
import { ColumnProps } from "antd/es/table";
import { Table } from "antd";
import {
  getArticleList,
  QINIU_CLIENT,
  changeArticlePass,
  changeArticleBanned,
  changeArticleRecommend
} from "@/api";
import "./index.scss";

export interface IArticleListData {
  _id: string;
  author_id: string;
  author: string;
  summary: string;
  banned: number;
  cover: string;
  created: string;
  pass: number;
  recommend: number;
  collection_number: number;
  comment_number: number;
  reading_number: number;
  star_number: number;
  title: string;
  type: string;
  updated: string;
}

const PAGE_SIZE = 5;
const passTapData: ISelectTagData = [
  { name: "过审", color: "green", key: 1 },
  { name: "未过", color: "red", key: 0 }
];

interface IArticleList extends RouteConfigComponentProps {
  type?: "read" | "fm" | "music" | "movie" | "image";
}

const ArticleList = ({ type = "read" }: IArticleList) => {
  const [articleList, setArticleList] = useState([]);

  const [sorterKey, setSorterKey] = useState("");
  const [sorterMethod, setSorterMethod] = useState<
    "descend" | "ascend" | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  // 获取or更新数据
  const fetchData = useCallback(async () => {
    let res;
    if (!sorterMethod) {
      res = await getArticleList(type, PAGE_SIZE, page, false);
    } else {
      res = await getArticleList(
        type,
        PAGE_SIZE,
        page,
        false,
        sorterKey,
        sorterMethod
      );
    }
    if (res.status === 200 && res.data.type === "success") {
      setArticleList(res.data.list);
      setTotal(+res.data.total);
    }
    setLoading(false);
  }, [page, sorterKey, sorterMethod, type]);

  // 初始化和页数更改时触发
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const changePass = useCallback(
    async (_id: string, pass: number) => {
      const res = await changeArticlePass(_id, pass);
      if (res.data.type === "success") {
        fetchData();
      }
    },
    [fetchData]
  );

  const changeBanned = useCallback(
    async (_id: string, banned: number) => {
      const res = await changeArticleBanned(_id, banned);
      if (res.data.type === "success") {
        fetchData();
      }
    },
    [fetchData]
  );

  const changeRecommend = useCallback(
    async (_id: string, recommend: number) => {
      const res = await changeArticleRecommend(_id, recommend);
      if (res.data.type === "success") {
        fetchData();
      }
    },
    [fetchData]
  );

  const handleChange = useCallback(
    ({ current }, _, { field, order }: SorterResult<IArticleListData>) => {
      if (sorterKey !== field || sorterMethod !== order) {
        setLoading(true);
        setSorterKey(field);
        setSorterMethod(order);
      }
      if (page !== current - 1) {
        setLoading(true);
        setPage(current - 1);
      }
    },
    [page, sorterKey, sorterMethod]
  );

  const columns: ColumnProps<IArticleListData>[] = [
    {
      title: "标题",
      dataIndex: "title",
      sorter: true,
      width: "10%",
      render: (title: string, { _id }: { _id: string }) => `《${title}》`
    },
    {
      title: "作者",
      dataIndex: "author",
      sorter: true,
      width: "8%",
      ellipsis: true
    },
    {
      title: "摘要",
      dataIndex: "summary",
      ellipsis: true
    },
    {
      title: "封面",
      dataIndex: "cover",
      width: "10%",
      render: (cover: string) => (
        <img
          src={`${QINIU_CLIENT}/${cover}`}
          className="table-cover"
          alt="cover"
        />
      )
    },
    {
      title: "数据",
      children: [
        {
          title: "阅读",
          dataIndex: "reading_number",
          sorter: true,
          width: "4.5%"
        },
        {
          title: "收藏",
          dataIndex: "collection_number",
          sorter: true,
          width: "4.5%"
        },
        {
          title: "点赞",
          dataIndex: "star_number",
          sorter: true,
          width: "4.5%"
        },
        {
          title: "评论",
          dataIndex: "comment_number",
          sorter: true,
          width: "4.5%"
        }
      ]
    },
    {
      title: "更新时间",
      dataIndex: "updated",
      width: "9%",
      sorter: true,
      render: updated => new Date(updated).toLocaleString()
    },
    {
      title: "创建时间",
      dataIndex: "created",
      width: "9%",
      sorter: true,
      render: created => new Date(created).toLocaleString()
    },
    {
      title: "审阅",
      dataIndex: "pass",
      width: "7%",
      sorter: true,
      render: (pass, { _id }) => (
        <SelectTap
          data={passTapData}
          current={pass}
          onSelect={p => changePass(_id, pass ? 0 : 1)}
        />
      )
    },
    {
      title: "推荐",
      dataIndex: "recommend",
      width: "7%",
      sorter: true,
      render: (recommend, { _id }) => (
        <BannedSwitch
          checked={recommend}
          onClick={async () => await changeRecommend(_id, recommend ? 0 : 1)}
        />
      )
    },
    {
      title: "有效",
      dataIndex: "banned",
      width: "7%",
      sorter: true,
      render: (banned, { _id }) => (
        <BannedSwitch
          checked={!banned}
          onClick={async () => await changeBanned(_id, banned ? 0 : 1)}
        />
      )
    }
  ];

  return (
    <>
      {articleList && (
        <Table
          loading={loading}
          bordered={true}
          columns={columns}
          dataSource={articleList}
          onChange={handleChange}
          pagination={{ pageSize: PAGE_SIZE, total, hideOnSinglePage: true }}
          rowKey="_id"
        />
      )}
    </>
  );
};

export default ArticleList;
