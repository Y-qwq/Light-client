const {
    override,
    fixBabelImports,
    addLessLoader,
    addWebpackAlias
} = require('customize-cra');
const path = require("path");

module.exports = override(
    fixBabelImports('import', [{
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: "css"
        // style: true,
    }, {
        libraryName: 'antd-mobile',
        style: "css",
    }]),
    addLessLoader({
        javascriptEnabled: true,
        // modifyVars: { '@primary-color': '#1DA57A' },
    }),
    addWebpackAlias({
        ["@"]: path.resolve(__dirname, 'src'),
    })
);