const {
    override,
    fixBabelImports,
    addLessLoader,
    addWebpackAlias
} = require('customize-cra');
const path = require("path");

module.exports = override(
    fixBabelImports('import', [{
        libraryName: "antd",
        style: "css",
    }, {
        libraryName: '@material-ui/core',
        libraryDirectory: 'esm',
        camel2DashComponentName: false
    }]),
    addLessLoader({
        javascriptEnabled: true,
        // modifyVars: { '@primary-color': '#1DA57A' },
    }),
    addWebpackAlias({
        ["@"]: path.resolve(__dirname, 'src'),
    })
);