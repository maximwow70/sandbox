const environment = {
    DEV: "dev",
    PROD: "prod",
};

const webpack = require("webpack");

const SimpleProgressPlugin = require("webpack-simple-progress-plugin");
const LiveReloadPlugin = require("webpack-livereload-plugin");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const extractStyles = new ExtractTextPlugin("styles.css");
const autoprefixer = require("autoprefixer");

module.exports = env => {
    const constants = {};

    const ENV = env.NODE_ENV || environment.DEV;
    const isDevelopment = ENV === environment.DEV;

    const baseStyleLoaders = [
        {
            loader: 'css-loader',
            options: {
                sourceMap: isDevelopment
            }
        },
        {
            loader: "resolve-url"
        },
        {
            loader: "postcss-loader",
            options: {
                plugins: () => [
                    autoprefixer({
                        browsers: ["ie >= 10", "last 4 version"]
                    })
                ],
                sourceMap: isDevelopment
            }
        }
    ];

    const config = {
        entry: {
            bundle: "./src/index.ts"
        },
        output: {
            path: __dirname + "/dist/",
            filename: "[name].js",
            library: "[name]"
        },
        resolve: {
            modules: ["node_modules"],
            extensions: ["*", ".ts", ".js"]
        },
        resolveLoader: {
            modules: ["node_modules"],
            moduleExtensions: ["-loader"],
            extensions: ["*", ".js"]
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                    query: {
                        presets: ["es2015"],
                    }
                },
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    loader: extractStyles.extract({
                        fallback: "style-loader",
                        use: [
                            { loader: "style-loader" },
                            ...baseStyleLoaders
                        ]
                    })
                },
                {
                    test: /\.s[ac]ss$/,
                    loader: extractStyles.extract({
                        fallback: "style-loader",
                        use: [
                            ...baseStyleLoaders,
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: isDevelopment
                                }
                            }
                        ]
                    })
                },
                {
                    test: /\.woff2?$|\.ttf$|\.eot$|\.otf$|\.svg$|\.png|\.jpe?g|\.gif$/,
                    loader: "file-loader",
                    options: {
                        outputPath: "./assets/", // relative to dist
                        name(file) {
                            return isDevelopment ? "[name].[ext]" : "[hash].[ext]";
                        }
                    }
                },
                {
                    test: /index\.html$/,
                    loader: "html-loader",
                    options: {
                        name: "../dist/index.html",
                        minimize: true,
                        removeComments: false,
                        collapseWhitespace: false
                    }
                }
            ]
        },
        watch: isDevelopment,
        watchOptions: {
            aggregateTimeout: 100
        },
        devtool: isDevelopment ? "source-map" : "null",
        plugins: [
            extractStyles,
            new SimpleProgressPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.DefinePlugin({
                LANG: "RU",
                environment: JSON.stringify(ENV),
                _environmentConstants: constants
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: "common",
                minChunks: 2
            }),
            new CleanWebpackPlugin(["dist/*"], {}),
            new CopyWebpackPlugin([
                {
                    from: "**/*.html",
                    to: "./",
                    context: "./src/",
                    ignore: ["index.html"]
                },
                { from: "./src/index.html", to: "./index.html" },
                // { from: "assets/**/*", to: "./", context: "./src/" } // todo: replace with file loader
            ], {})
            // new LiveReloadPlugin()
        ],
        devServer: {
            host: "localhost",
            port: "8040"
        }
    };

    if (!isDevelopment) {
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    drop_console: true,
                    unsafe: true
                }
            })
        );
    }

    return config;
};