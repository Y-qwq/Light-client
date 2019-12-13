import React, { useState, useCallback } from "react";
import { Switch } from "antd";
import { SwitchChangeEventHandler } from "antd/lib/switch";

interface IBannedSwitch {
  checked: boolean;
  onClick: SwitchChangeEventHandler | undefined;
}

const BannedSwitch = ({ checked, onClick }: IBannedSwitch) => {
  const [loading, setLoading] = useState(false);

  const handleSwitchBanned = useCallback(
    async (checked: boolean, event: MouseEvent) => {
      setLoading(true);
      if (onClick) {
        await onClick(checked, event);
      }
      setLoading(false);
    },
    [onClick]
  );

  return (
    <Switch loading={loading} checked={checked} onClick={handleSwitchBanned} />
  );
};

export default BannedSwitch;
