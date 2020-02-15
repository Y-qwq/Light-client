const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias,
  addWebpackPlugin
} = require("customize-cra");
const path = require("path");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

const isEnvProduction = process.env.NODE_ENV === "production";

const addCustomize = () => config => {
  if (isEnvProduction) {
    config.plugins.push(
      // gzip压缩
      new CompressionWebpackPlugin({
        test: /\.(css|js)$/,
        // 只处理比1kb大的资源
        threshold: 1024,
        // 只处理压缩率低于90%的文件
        minRatio: 0.9
      })
    );
    // 查看打包后各包大小
    // config.plugins.push(new BundleAnalyzerPlugin());
  }
  return config;
};

module.exports = override(
  // 按需加载
  fixBabelImports("import", [
    {
      libraryName: "antd",
      libraryDirectory: "es",
      style: "css"
    },
    {
      libraryName: "@material-ui/core",
      libraryDirectory: "esm",
      camel2DashComponentName: false
    }
  ]),
  addLessLoader({
    javascriptEnabled: true
    // modifyVars: { '@primary-color': '#1DA57A' },
  }),
  addCustomize(),
  addWebpackPlugin(
    // 终端进度条显示
    new ProgressBarPlugin()
  ),
  addWebpackAlias({
    ["@"]: path.resolve(__dirname, "src")
  })
);
