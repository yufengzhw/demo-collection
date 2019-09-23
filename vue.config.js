module.exports = {
  outputDir: 'server/public',
  devServer: {
    proxy: 'http://localhost:20020'
  }
}
