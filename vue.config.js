module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://api.vikingship.xyz/api', // 需要跨域的目标url ,我这里是自己本地起的一个服务端口
        changeOrigin: true, // 将基于名称的虚拟托管网站的选项，如果不配置，请求会报404
        pathRewrite: {
          '^/api': '' // 若请求的路径在目标url下但不在/api 下，则将其转换成空
        }
      }
    }
  }
}