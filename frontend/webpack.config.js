//https://www.npmjs.com/package/style-loader

module.exports = {
  twin: {
    styled: "styled-components",
    config: "./tailwind.config.js",
    format: "auto"
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

};

