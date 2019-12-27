const getTime = (time: string | number) => {
  const t = new Date(time);
  let res = "";
  res += t.getFullYear() + ".";
  res += t.getMonth() + ".";
  res += t.getDate() + " ";
  res += t.getHours() < 10 ? "0" + t.getHours() : t.getHours();
  res += ":";
  res += t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes();
  return res;
};

export default getTime;
