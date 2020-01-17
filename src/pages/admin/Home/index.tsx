import React, { useState, useEffect } from "react";
import { QINIU_CLIENT, getSystemInfo } from "@/api";
import { Avatar, Card, Calendar } from "antd";
import { Line } from "@antv/g2plot";
import { useSelector } from "react-redux";
import { IState } from "@/redux/reducers";
import "./index.scss";

interface IInfo {
  date: string;
  read_count: number;
  author_count: number;
  registration_count: number;
  write_article_count: number;
  last_seven_read_count: { read_count: number; date: string }[];
}

const AdminHome: React.SFC = () => {
  const user = useSelector((state: IState) => state.user.info);
  const [info, setInfo] = useState<IInfo>();

  useEffect(() => {
    (async () => {
      const res = await getSystemInfo();
      if (res.data?.type === "success") {
        const last_seven_read_count = res.data.info.last_seven_read_count;
        for (let i = 0; i < last_seven_read_count.length; i++) {
          const t = new Date(last_seven_read_count[i].date);
          last_seven_read_count[i].date = t.getMonth() + 1 + "." + t.getDate();
        }
        setInfo({ ...res.data.info, last_seven_read_count });
      }
    })();
  }, []);

  useEffect(() => {
    if (info) {
      const target = document.getElementById("last-seven-read-line-chart");
      if (target) {
        const areaPlot = new Line(target, {
          title: {
            visible: true,
            text: "最近七日阅读量折线图"
          },
          data: info.last_seven_read_count,
          meta: {
            date: {
              alias: "时间"
            },
            read_count: {
              alias: "阅读量"
            }
          },
          xField: "date",
          yField: "read_count"
        });
        areaPlot.render();
      }
    }
  }, [info]);

  return (
    <div className="admin-home">
      <div className="admin-home-left">
        <div className="account-info">
          <Avatar
            size={72}
            shape="square"
            className="account-info-avatar"
            src={`${QINIU_CLIENT}/avatar/${user._id}?h=${user.avatar}`}
          >
            A
          </Avatar>
          <p className="account-info-name">{user.username}</p>
          {user.lastLoginDate && (
            <p className="account-info-last-date">
              最后登录时间：{new Date(user.lastLoginDate).toLocaleString()}
            </p>
          )}
          {user.lastLoginAddress && (
            <p className="account-info-last-address">
              最后登录地点：{user.lastLoginAddress}
            </p>
          )}
        </div>
        <div className="admin-home-calendar">
          <Calendar fullscreen={false} />
        </div>
      </div>
      <div className="admin-home-right">
        <div className="admin-home-card-group">
          <Card className="admin-home-statistics" title="今日新增用户">
            {info?.registration_count}
          </Card>
          <Card className="admin-home-statistics" title="今日阅读量">
            {info?.read_count}
          </Card>
          <Card className="admin-home-statistics" title="今日新增文章">
            {info?.write_article_count}
          </Card>
          <Card className="admin-home-statistics" title="总作者数">
            {info?.author_count}
          </Card>
        </div>
        <div className="admin-home-chart">
          <div id="last-seven-read-line-chart"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
