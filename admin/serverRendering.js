import React from "react";
import ReactDOM from "react-dom/server";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "node-fetch";
import { StaticRouter } from "react-router";
import { ApolloProvider, getDataFromTree } from "react-apollo";
import ApolloClient from "apollo-client";
import config from "../config";
import { GET_OPTIONS } from "../shared/queries/Queries";
import { getDirectories } from "../shared/dir";
import path from "path";
import fs from "fs";

// const getClient = () => {
//     return new ApolloClient({
//         ssrMode: false,
//         link: createHttpLink({
//             uri: config.apiUrl,
//             fetch
//         }),
//         cache: new InMemoryCache()
//     });
// };
const client = () =>
    new ApolloClient({
        ssrMode: false,
        link: createHttpLink({
            uri: config.apiUrl,
            fetch
        }),
        cache: new InMemoryCache()
    });

module.exports.init = app => {
    app.get(config.baseName + "admin/getThemes", (req, res) => {
        client()
            .query({ query: GET_OPTIONS })
            .then(settings => {
                let theme = settings.data.settings.filter(
                    item => item.option == "theme"
                )[0].value;
                console.log("=====xxxxxxx>>>>", theme);
                const availableThemes = [];
                getDirectories(path.join(__dirname, "../client/themes/")).map(
                    themePath => {
                        if (fs.existsSync(themePath + "/config.json")) {
                            const details = require(themePath + "/config.json");
                            const name = themePath.split("/").pop(-1);
                            availableThemes.push({
                                ...details,
                                name: name,
                                active: name === theme
                            });
                        }
                    }
                );
                res.send(availableThemes);
            });
    });

    app.get(config.baseName + "admin/*", (req, res) => {
        //const client = getClient();
        client()
            .query({ query: GET_OPTIONS })
            .then(settings => {
                let theme = settings.data.settings.filter(
                    item => item.option == "theme"
                )[0].value;

                // In dev mode if a theme is explicitly called, then use that
                if (process.env.THEME && process.env.THEME !== "") {
                    theme = process.env.THEME;
                }
                const sendResponse = ({ content, initialState }) => {
                    const html = (
                        <Html
                            theme={theme}
                            content={content}
                            state={initialState}
                        />
                    );
                    res.status(200);
                    res.send(
                        `<!doctype html>\n${ReactDOM.renderToStaticMarkup(
                            html
                        )}`
                    );
                    res.end();
                };
                let initialState = {};
                sendResponse({ content: null, initialState });
            });
    });
};

function Html({ theme, content, state }) {
    const devBundles = [
        "/static/admin/public/dist/vendor-bundle.js",
        "/static/admin/public/dist/admin-bundle.js"
    ];
    const prodBundles = [
        "/admin/dist/vendor-bundle.min.js",
        "/admin/dist/admin-bundle.min.js"
    ];
    const bundles =
        process.env.NODE_ENV === "production" ? prodBundles : devBundles;

    const insertScript = script => (
        <script type="text/javascript" src={config.rootUrl + script} defer />
    );

    const insertStyle = style => (
        <link
            href={config.rootUrl + "/admin" + style}
            rel="stylesheet"
            type="text/css"
        />
    );

    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>Letterpad</title>

                <link
                    href="https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,700"
                    rel="stylesheet"
                    type="text/css"
                />
                {insertStyle("/css/bootstrap.min.css")}
                {insertStyle("/css/vertical.css")}
                {insertStyle("/css/font-awesome.min.css")}
                <link
                    href="http://cdn.jsdelivr.net/highlight.js/9.8.0/styles/github.min.css"
                    rel="stylesheet"
                    type="text/css"
                />
                <link
                    href="https://cdn.quilljs.com/1.2.2/quill.snow.css"
                    rel="stylesheet"
                    type="text/css"
                />
                {insertStyle("/dist/admin.min.css")}
            </head>
            <body>
                <div id="app" dangerouslySetInnerHTML={{ __html: content }} />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.NODE_ENV = "${process.env.NODE_ENV}";`
                    }}
                />
                {insertScript("/admin/js/highlight.min.js")}
                <script
                    type="text/javascript"
                    src="https://cdn.quilljs.com/1.2.2/quill.js"
                    defer
                />
                {bundles.map(bundle => insertScript(bundle))}
            </body>
        </html>
    );
}
