import React, ***REMOVED*** Fragment ***REMOVED*** from "react";
import Document, ***REMOVED*** Html, Head, Main, NextScript ***REMOVED*** from "next/document";
import ***REMOVED*** ServerStyleSheets ***REMOVED*** from "@material-ui/styles";
import theme from "../components/theme";
import ***REMOVED*** GA_TRACKING_ID ***REMOVED*** from "../lib/gtag";

class MyDocument extends Document ***REMOVED***
  render() ***REMOVED***
    return (
      <Html lang="en">
        <Head>
          <script
            async
            src=***REMOVED***`https://www.googletagmanager.com/gtag/js?id=$***REMOVED***GA_TRACKING_ID***REMOVED***`***REMOVED***
          ></script>
          <script
            dangerouslySetInnerHTML=***REMOVED******REMOVED***
              __html: `window.dataLayer = window.dataLayer || [];
            function gtag()***REMOVED***dataLayer.push(arguments);***REMOVED***
            gtag('js', new Date());

            gtag('config', '$***REMOVED***GA_TRACKING_ID***REMOVED***');`
            ***REMOVED******REMOVED***
          ></script>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          <meta name="theme-color" content=***REMOVED***theme.palette.primary.main***REMOVED*** />
          <link
            href="https://fonts.googleapis.com/css?family=Nunito:400,800&display=swap"
            rel="stylesheet"
          />
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/favicon.ico"
          />
          <meta property="og:site_name" content="HuluSira" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@HuluSira" />
          <meta name="twitter:creator" content="@HuluSira" />
          <script
            crossOrigin="anonymous"
            src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"
          ></script>
          ***REMOVED***process.env.NODE_ENV === "production" && (
            <script
              data-ad-client="ca-pub-1430919979045648"
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            ></script>
          )***REMOVED***
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  ***REMOVED***
***REMOVED***

MyDocument.getInitialProps = async ctx => ***REMOVED***
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage(***REMOVED***
      enhanceApp: App => props => sheets.collect(<App ***REMOVED***...props***REMOVED*** />)
    ***REMOVED***);
  const initialProps = await Document.getInitialProps(ctx);

  return ***REMOVED***
    ...initialProps,
    styles: [
      <React.Fragment key="styles">
        ***REMOVED***initialProps.styles***REMOVED***
        ***REMOVED***sheets.getStyleElement()***REMOVED***
      </React.Fragment>
    ]
  ***REMOVED***;
***REMOVED***;

export default MyDocument;
