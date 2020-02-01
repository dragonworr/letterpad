/**
 * This file is the entry point for creating a build for the server for a particular theme. It is
 * used in webpack.dev.js and webpack.prod.js.
 * We wont be able to debug this file.
 *
 *
 * This file will return a promise
 */
const { ServerStyleSheet, StyleSheetManager } = require("styled-components");
import React from "react";
import { Helmet } from "react-helmet";
import { StaticRouter } from "react-router";
import { ApolloProvider } from "react-apollo";
import { renderToStringWithData } from "react-apollo";
import config from "../../config";
import ClientApp, { IRoutes } from "../ClientApp";
import { StaticContext } from "../Context";
import { ThemesQuery, ThemeSettings } from "../../__generated__/gqlTypes";
import { QUERY_THEMES } from "../../shared/queries/Queries";
import apolloClient from "../../shared/apolloClient";
import { TypeSettings, IServerRenderProps } from "../types";
import logger from "../../shared/logger";
import ssrFetch from "./ssrFetch";
import { getMatchedRouteData } from "./helper";

const serverApp = async (props: IServerRenderProps) => {
  const { requestUrl, client, settings, isStatic } = props;
  const opts = {
    location: requestUrl,
    context: {},
    basename: config.baseName.replace(/\/$/, ""), // remove the last slash
  };

  const initialData: IRoutes["initialData"] = {
    themeSettings: await getThemeSettings(settings),
    settings,
  };

  const sheet = new ServerStyleSheet(); // <-- creating out stylesheet
  const serverApp = (
    <StyleSheetManager sheet={sheet.instance}>
      <StaticRouter {...opts}>
        <ApolloProvider client={client}>
          <StaticContext.Provider value={{ isStatic }}>
            <ClientApp initialData={{ ...initialData }} />
          </StaticContext.Provider>
        </ApolloProvider>
      </StaticRouter>
    </StyleSheetManager>
  );
  const matchedRouteData = getMatchedRouteData(initialData, requestUrl);

  if (matchedRouteData) {
    try {
      const context = {
        client,
        match: matchedRouteData,
      };
      logger.debug("Matched route data: ", matchedRouteData);
      const initialProps = await ssrFetch(serverApp, context);
      const content = await renderToStringWithData(serverApp);
      const initialState = client.extract();
      return {
        head: Helmet.renderStatic(),
        html: content,
        initialData: { ...initialData, initialProps },
        apolloState: initialState,
        sheet: sheet,
      };
    } catch (error) {
      logger.error("Unable to render app");
      logger.error(error);
    }
  } else {
    logger.error("The incoming request could not be handled by the server");
  }
};

export default serverApp;
/**
 * Get app initial data
 */
async function getThemeSettings(
  settings: TypeSettings,
): Promise<ThemeSettings[] | []> {
  const client = apolloClient();
  let themeSettings: ThemeSettings[] | [] = [];
  try {
    const themeResult = await client.query<ThemesQuery>({
      query: QUERY_THEMES,
      variables: {
        name: settings.theme.value,
      },
    });
    if (themeResult.data && themeResult.data.themes.length > 0) {
      themeSettings = themeResult.data.themes[0].settings as ThemeSettings[];
    }
    return themeSettings;
  } catch (e) {}
  return themeSettings;
}