const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const path = require("path");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const { v4: uuidv4 } = require("uuid");
module.exports = async function (env, argv) {
 // Set by expo-cli during `expo build:web`
 const isEnvProduction = env.mode === "production";
 // Create the default config
 const config = await createExpoWebpackConfigAsync(env, argv);
 if (isEnvProduction) {
  config.plugins.push(
   // Generate a service worker script that will precache, and keep up to date,
   // the HTML & assets that are part of the webpack build.
   new WorkboxWebpackPlugin.InjectManifest({
    swSrc: path.resolve(__dirname, "src/service-worker.js"),
    dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
    exclude: [
     /\.map$/,
     /asset-manifest\.json$/,
     /LICENSE/,
     /\.js\.gz$/,
     /(apple-touch-startup-image|chrome-icon|apple-touch-icon).*\.png$/,
    ],
    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,    
   })
  );
 }
 config.module.rules.push({
  test: /uuid\.web\.js$/,
  use: [
   {
    loader: "babel-loader",
    options: {
     presets: ["@babel/preset-env"],
    },
   },
  ],
 });
 config.resolve.alias = {
  ...config.resolve.alias,
  crypto: false,
 };

 config.performance = {
    maxAssetSize: 586 * 1024 *1024, 
    maxEntrypointSize: 586 * 1024 *1024, 
  };
 return config;
};
