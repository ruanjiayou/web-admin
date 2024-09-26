const { defaultInjectConfig } = require('react-app-rewire-workbox')
const { override, fixBabelImports, addWebpackPlugin, overrideDevServer } = require('customize-cra')
const analyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const workboxPlugin = require('workbox-webpack-plugin')
// const path = require('path')
// const workboxConfig = {
//   ...defaultInjectConfig,
//   swSrc: path.join(__dirname, 'src', 'custom-sw.js'),
//   swDest: 'service-worker.js',
//   // importWorkboxFrom: 'local'
// }
// const plugin = new workboxPlugin.InjectManifest(workboxConfig)
module.exports = {
  devServer: overrideDevServer(config => {
    config.proxy = [
      {
        context: ['/gw/admin'],
        target: 'https://u67631x482.vicp.fun',
        changeOrigin: true,
        secure: false,
      }
    ]
    return config;
  }),
  webpack: override(
    // fixBabelImports('import', {
    //   libraryName: 'antd',
    //   style: 'css'
    // }),
    // addWebpackPlugin(plugin),
    addWebpackPlugin(new analyzer())
  )
}