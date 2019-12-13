import React, { useMemo } from "react";
import { Tag, Dropdown, Menu } from "antd";
import { ClickParam } from "antd/lib/menu";

export interface ISelectTagOnSelect extends ClickParam {}

export interface ISelectTagData
  extends Array<{ name: string; color: string; key: string | number }> {}

interface ISelectTagProps {
  current: number;
  onSelect?: (params: ClickParam) => void;
  data: ISelectTagData;
}

const SelectTap = ({ current, data, onSelect }: ISelectTagProps) => {
  const menu = useMemo(() => {
    const taps = [];
    for (let index = 0; index < data.length; index++) {
      const value = data[index];
      taps.push(
        <Menu.Item key={index}>
          <Tag color={value.color} style={{ marginRight: 0 }}>
            {value.name}
          </Tag>
        </Menu.Item>
      );
      index !== data.length - 1 && taps.push(<Menu.Divider key={-index - 9} />);
    }
    return <Menu onClick={onSelect}>{taps}</Menu>;
  }, [data, onSelect]);

  const curValue = useMemo(
    () => data.filter(value => value.key === current)[0] || {},
    [current, data]
  );

  return (
    <Dropdown overlay={menu}>
      <Tag color={curValue.color}>{curValue.name}</Tag>
    </Dropdown>
  );
};

export default SelectTap;
