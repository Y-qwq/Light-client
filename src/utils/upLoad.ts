import { upload as up, Observer, Config, Extra, region } from "qiniu-js";

export const upload = (
  file: Blob,
  name: string,
  token: string,
  putExtra: Extra = { fname: "", params: {}, mimeType: null },
  config: Config = {
    useCdnDomain: false,
    region: region.z2,
    disableStatisticsReport: false,
    retryCount: 3,
    concurrentRequestLimit: 4,
    checkByMD5: false,
    forceDirect: false,
    uphost: "https://upload-z2.qiniup.com"
  },
  observer: Observer
) => {
  const observable = up(file, name, token, putExtra, config);
  const subscription = observable.subscribe(observer);
  return subscription;
};
