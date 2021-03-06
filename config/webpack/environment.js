const { environment } = require('@rails/webpacker')

const webpack = require("webpack");
// Add an ProvidePlugin
environment.plugins.prepend("Provide",
  new webpack.ProvidePlugin({
    $: "jquery/src/jquery",
    jQuery: "jquery/src/jquery",
    jquery: "jquery/src/jquery",
    Popper: ['popper.js', 'default']
  })
);

const config = environment.toWebpackConfig();

config.resolve.alias = {
  jquery: "jquery/src/jquery"
};

module.exports = environment
