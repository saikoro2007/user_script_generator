module.exports = {
  outputDir: 'docs',
  publicPath: process.env.NODE_ENV === 'production'
    ? '/user_script_generator/'
    : '/'
}