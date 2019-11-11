const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "production",
    context: path.resolve(__dirname),
    entry: {
        "app": "./src/main.react.tsx"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    output: {
        path: path.resolve(__dirname, "dist/public"),
        filename: "main.react.bundle.js"
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./resources/index.html"
        }),
        new CopyWebpackPlugin([
            { from: "./resources/favicon/**/*", to: "./assets/", flatten: true }
        ])
    ]
};
