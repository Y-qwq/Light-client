const checkMobile = () => {
  const ua = navigator.userAgent;
  const Agents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod"
  ];
  for (var v = 0; v < Agents.length; v++) {
    if (ua.indexOf(Agents[v]) > 0) {
      return true;
    }
  }
  return false;
};

export default checkMobile;
