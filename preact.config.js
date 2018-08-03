export default (config, env, helpers) => {
  if (env.isProd) {
    // Fix for async / await
    // https://github.com/developit/preact-cli/issues/578#issuecomment-393768571
    let babel = config.module.loaders.filter(
      loader => loader.loader === 'babel-loader'
    )[0].options
    babel.presets[0][1].exclude.push('transform-async-to-generator')
    babel.plugins.push([require.resolve('fast-async'), { spec: true }])
  }
}
