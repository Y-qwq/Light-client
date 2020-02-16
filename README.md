# 毕设前端

毕业设计项目，客户端主要包含文章分类、阅读、收藏、评论、点赞等功能，后台分为作者、管理员权限，主要包含系统运维信息、用户管理、文章写作与管理等功能。

前端技术栈：纯React Hooks、Redux、TypeScript、antd，基于react-router-config库改造路由配置模块，使其支持页面的权限自动校验、多重路由匹配等功能。并添加webpack配置进行打包优化（关闭sourceMap、gzip压缩、按需引入、路径别名等）。

后端技术栈：TypeScript、Koa、MongoDB、七牛云对象存储与CDN加速，使用JWT配合洋葱路由模型对请求进行权限校验。

以UA作为判断，区分PC端和移动端，分别进入管理登录页面以及客户端登录界面。

# 运行截图

## 客户端

![阅读界面](https://github.com/Y-qwq/Light-client/blob/master/screenshot/READ_1.png)

---

![评论界面](https://github.com/Y-qwq/Light-client/blob/master/screenshot/READ_2.png)

---

![主页界面](https://github.com/Y-qwq/Light-client/blob/master/screenshot/ALL.png)

---

![推荐文章界面](https://github.com/Y-qwq/Light-client/blob/master/screenshot/LIGHT.png)

---

![个人界面](https://github.com/Y-qwq/Light-client/blob/master/screenshot/ME.png)

---

![登录界面](https://github.com/Y-qwq/Light-client/blob/master/screenshot/LOGIN.png)

## PC端

![信息界面](https://github.com/Y-qwq/Light-client/blob/master/screenshot/HOME.png)

---

![用户管理界面](https://github.com/Y-qwq/Light-client/blob/master/screenshot/USERS.png)

---

![文章写作界面](https://github.com/Y-qwq/Light-client/blob/master/screenshot/WRITE.png)

---

![文章管理界面](https://github.com/Y-qwq/Light-client/blob/master/screenshot/LIST.png)
