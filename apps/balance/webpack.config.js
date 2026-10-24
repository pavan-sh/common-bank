const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const Dotenv = require("dotenv-webpack");
const path = require("path");

module.exports = {
  // Start the remote's standalone preview bundle from its React entry point.
  entry: "./src/index.tsx",
  output: {
    // Let Webpack resolve remote assets relative to the loaded remote entry.
    publicPath: "auto",
    // Remove stale output files before each build.
    clean: true,
    // Write the compiled remote files into this app's dist folder.
    path: path.resolve(__dirname, "dist"),
  },
  // Resolve these extensions so imports can omit their file suffix.
  resolve: { extensions: [".tsx", ".ts", ".js"] },
  devServer: {
    // Keep the remote on port 3001; the host uses port 3000.
    port: 3001,
    // Enable fast browser refresh while developing the remote standalone.
    hot: true,
    // Allow the host at another local origin to fetch the remote entry and chunks.
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  module: {
    rules: [
      // Compile TypeScript and TSX source files, excluding installed packages.
      { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
      // Inject CSS into the page after resolving imports and processing Tailwind.
      { test: /\.css$/, use: ["style-loader", "css-loader", "postcss-loader"] },
    ],
  },
  plugins: [
    new Dotenv({
      // Read optional local sandbox settings from the repository-root .env file.
      path: path.resolve(__dirname, "../../.env"),
      // Do not require an .env file; sample balances work without credentials.
      safe: false,
      // Also allow values supplied in the shell environment.
      systemvars: true,
      // Do not print a warning when the optional .env file is missing.
      silent: true,
    }),
    new ModuleFederationPlugin({
      // Container name must match the name before `@` in the host's remote URL.
      name: "balance",
      // This file is fetched by the host to discover and load exposed modules.
      filename: "remoteEntry.js",
      // Publish the balance widget so the host can import
      // `balance/BalanceWidget`.
      exposes: { "./BalanceWidget": "./src/BalanceWidget" },
      shared: {
        // Share one compatible React instance with the host to keep hooks and
        // component ownership on the same React runtime.
        react: { singleton: true, requiredVersion: "^19.2.0" },
        // Keep React DOM on the same compatible singleton version too.
        "react-dom": { singleton: true, requiredVersion: "^19.2.0" },
        // Reuse the host query client/cache when federated; the standalone
        // Balance entry still creates its own provider when run by itself.
        "@tanstack/react-query": {
          singleton: true,
          requiredVersion: "^5.90.2",
        },
        // Use the shared query/API helper also consumed by the host.
        "@toy-finance/bank-data": {
          singleton: true,
          requiredVersion: "1.0.0",
        },
      },
    }),
    // Create the remote's standalone preview page; the host loads remoteEntry.js.
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
  ],
};
