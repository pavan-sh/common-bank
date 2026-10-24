const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const Dotenv = require("dotenv-webpack");
const path = require("path");

module.exports = {
  // Start the host bundle from its React entry point.
  entry: "./src/index.tsx",
  output: {
    // Let Webpack infer asset URLs from the host page or remote runtime.
    publicPath: "auto",
    // Remove stale output files before each build.
    clean: true,
    // Write the compiled host files into this app's dist folder.
    path: path.resolve(__dirname, "dist"),
  },
  // Resolve these extensions so imports can omit their file suffix.
  resolve: { extensions: [".tsx", ".ts", ".js"] },
  devServer: {
    // Keep the host on port 3000, separate from the Balance remote.
    port: 3000,
    // Send client-side routes back to the host HTML entry point.
    historyApiFallback: true,
    // Enable fast browser refresh while developing.
    hot: true,
    // Allow the browser to load the remote from its separate local origin.
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
      // Load the same local sandbox settings used by the Balance remote.
      path: path.resolve(__dirname, "../../.env"),
      safe: false,
      systemvars: true,
      silent: true,
    }),
    new ModuleFederationPlugin({
      // Unique runtime name for this host's Module Federation container.
      name: "financeHost",
      // `balance` is the import prefix used by the host, for example
      // `import("balance/BalanceWidget")`. The URL serves the remote manifest.
      remotes: { balance: "balance@http://localhost:3001/remoteEntry.js" },
      shared: {
        // Use one compatible React instance across the host and remote; React
        // components must not be mounted with separate React copies.
        react: { singleton: true, requiredVersion: "^19.2.0" },
        // Keep React DOM on the same compatible singleton version too.
        "react-dom": { singleton: true, requiredVersion: "^19.2.0" },
        // Share the query package so the federated widget can use the host's
        // QueryClientProvider and cache rather than creating a second cache.
        "@tanstack/react-query": {
          singleton: true,
          requiredVersion: "^5.90.2",
        },
        // Share the API/query-key helper so host and remote always use the
        // exact same TanStack Query key and request implementation.
        "@toy-finance/bank-data": {
          singleton: true,
          requiredVersion: "1.0.0",
        },
      },
    }),
    // Create the host HTML page and attach the generated JavaScript bundles.
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
  ],
};
