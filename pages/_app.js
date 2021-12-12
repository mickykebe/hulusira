import React from "react";
import NProgress from "nprogress";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import api from "../api";
import theme from "../components/theme";
import GlobalCss from "../components/global-css";
import * as gtag from "../lib/gtag";
import "easymde/dist/easymde.min.css";
import { Box } from "@material-ui/core";
import { GA_TRACKING_ID } from "../lib/gtag";

NProgress.configure({ showSpinner: false });

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", (url) => {
  NProgress.done();
  gtag.pageview(url);
});
Router.events.on("routeChangeError", () => NProgress.done());

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let user;
    let pageProps = {};
    try {
      user = await api.activeUser(ctx);
    } catch (err) {
      user = null;
    }
    ctx.user = user;
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps: { user, ...pageProps } };
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Box>
        <Head>
          <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
          <link rel="stylesheet" type="text/css" href="/nprogress.css" />
          {GA_TRACKING_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}></script>
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_TRACKING_ID}');`,
                }}></script>
            </>
          )}
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/favicon.ico"
          />
          <meta
            property="og:site_name"
            content={process.env.NEXT_PUBLIC_APP_NAME}
          />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary" />
          <meta
            name="twitter:site"
            content={`@${process.env.NEXT_PUBLIC_APP_NAME}`}
          />
          <meta
            name="twitter:creator"
            content={`@${process.env.NEXT_PUBLIC_APP_NAME}`}
          />
          <script
            crossOrigin="anonymous"
            src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"></script>
          {process.env.NODE_ENV === "production" &&
            process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
              <script
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
            )}
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/*  <GlobalCss /> */}
          <Component {...pageProps} />
        </ThemeProvider>
      </Box>
    );
  }
}

export default MyApp;
