import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { adminAction } from "@/redux/action";
import { IState, IDataUser } from "@/redux/reducers";
import { getAllUser } from "@/api";
import { message } from "antd";

const useFetchUserList: () => [IDataUser[], () => Promise<void>] = () => {
  const dispatch = useDispatch();
  const userList = useSelector((state: IState) => state.data.userList);

  const fetchUserList = useCallback(async () => {
    const res = await getAllUser();
    if (res.data.type === "success") {
      dispatch(adminAction.setUserList(res.data.userList));
    } else {
      message.error("获取用户列表失败！");
    }
  }, [dispatch]);

  useEffect(() => {
    (() => {
      userList.length === 0 && fetchUserList();
    })();
  }, [fetchUserList, userList.length]);

  return [userList, fetchUserList];
};

export default useFetchUserList;
