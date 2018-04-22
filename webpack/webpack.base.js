const webpack = require("webpack");
const path = require("path");
var FileNameReplacementPlugin = require("./FileNameReplacementPlugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

const isDev = process.env.NODE_ENV === "dev" ? true : false;

var babelOptions = {
    presets: [
        "react",
        [
            "env",
            {
                targets: {
                    browsers: ["last 2 versions", "safari >= 7"]
                },
                modules: false,
                useBuiltIns: false
            }
        ]
    ],
    plugins: ["transform-object-rest-spread", "react-hot-loader/babel"]
};

const vendorFiles = [
    "babel-polyfill",
    "react",
    "react-dom",
    "redux",
    "react-apollo",
    "moment"
];
if (isDev) {
    vendorFiles.push("webpack-hot-middleware/client?reload=true");
}
module.exports = args => {
    const config = {
        mode: isDev ? "development" : "production",
        watch: isDev,
        entry: {
            ["public/js/vendor"]: vendorFiles,
            ["client/themes/" + args.theme + "/public/dist/client"]: [
                path.join(__dirname, "../client/app")
            ],
            "admin/public/dist/admin": [path.join(__dirname, "../admin/app")]
        },
        resolve: {
            alias: {
                admin: path.join(__dirname, "../admin"),
                client: path.join(__dirname, "../client"),
                shared: path.join(__dirname, "../shared"),
                config: path.join(__dirname, "../config")
            },
            extensions: [".js"]
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify(isDev ? "dev" : "production")
                }
            }),
            new FileNameReplacementPlugin(args.theme),
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/)
        ],

        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: {
                        loader: "babel-loader",
                        options: babelOptions
                    },
                    include: path.join(__dirname, "../client")
                },
                // js
                {
                    test: /\.js$/,
                    use: {
                        loader: "babel-loader",
                        options: babelOptions
                    },
                    include: path.join(__dirname, "../admin")
                },
                {
                    test: /\.html$/,
                    use: {
                        loader: "html-loader"
                    }
                }
            ]
        }
    };

    if (isDev) {
        console.log("​-------------");
        console.log("​isDev", isDev);
        console.log("​-------------");
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return config;
};
