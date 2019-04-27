module.exports = {
  // The github project name (required for proper deployment of dist/)
  publicPath: 'LD44',

  // Auto fix linting errors
  // From https://www.reddit.com/r/vuejs/comments/8kn8dh/autofix_linting_errors_with_vuecli_3/e2rz9bv?utm_source=share&utm_medium=web2x
  chainWebpack: config => {
    config.module.rule('eslint').use('eslint-loader').options({
      fix: true
    })
  }
}