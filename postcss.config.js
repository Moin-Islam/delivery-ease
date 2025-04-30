module.exports = {
    plugins: {
      autoprefixer: {},  // Adds vendor prefixes to CSS rules
      "postcss-preset-env": {
        stage: 1, // Enables CSS features that are closer to being standardized
      },
    },
  }