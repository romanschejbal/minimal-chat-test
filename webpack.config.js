module.exports = {
  entry: './client.js',
  output: {
    filename: './public/build.js'
  },
  module: {
    loaders: [
      { test: /(client\.js|app\/.*\.js)/, loaders: ['babel-loader'] }
    ]
  }
};
