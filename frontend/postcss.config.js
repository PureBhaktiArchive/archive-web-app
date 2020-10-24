module.exports = {
  plugins: [
    
    require('tailwindcss')('./tailwindcss-config.js'),
    require('autoprefixer'),

    'tailwindcss',
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
        features: {
          'custom-properties': false,
        },
      },
    ],
  ],
}
