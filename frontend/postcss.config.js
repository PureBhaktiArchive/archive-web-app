// configuration for tailwind and purgecss. See https://github.com/tailwindlabs/designing-with-tailwindcss/blob/master/01-getting-up-and-running/08-optimizing-for-production/postcss.config.js

// https://github.com/tailwindlabs/tailwindcss-setup-examples/tree/master/examples/nextjs

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    process.env.NODE_ENV === 'production' && require('@fullhuman/postcss-purgecss')({
      content: [
        './src/**/**/*.js',
        './src/**/**/*.jsx',
        './public/index.html',
      ],
      defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
    })
  ]
}