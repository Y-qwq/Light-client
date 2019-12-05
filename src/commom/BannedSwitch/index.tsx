import React, { useState, useCallback } from "react";
import { Switch } from "antd";
import { changeUserBanned } from "@/api";
import useFetchUserList from "@/hooks/useFetchUserList";

interface IBannedSwitch {
  banned: number;
  _id: string;
}

const BannedSwitch = ({ banned, _id }: IBannedSwitch) => {
  const [, updateUserList] = useFetchUserList();
  const [loading, setLoading] = useState(false);

  const handleSwitchBanned = useCallback(() => {
    setLoading(true);
    (async () => {
      const res = await changeUserBanned(_id, banned ? 0 : 1);
      if (res.data.type === "success") {
        await updateUserList();
      }
      setLoading(false);
    })();
  }, [_id, banned, updateUserList]);

  return (
    <Switch loading={loading} checked={!banned} onClick={handleSwitchBanned} />
  );
};

export default BannedSwitch;
