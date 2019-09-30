import React from "react";
import Document, ***REMOVED*** Head, Main, NextScript ***REMOVED*** from "next/document";
import ***REMOVED*** ServerStyleSheets ***REMOVED*** from "@material-ui/styles";
import theme from "../components/theme";

class MyDocument extends Document ***REMOVED***
  render() ***REMOVED***
    return (
      <html lang="en">
        <Head>
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
          <meta property="og:site_name" content="HuluSira" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@HuluSira" />
          <meta name="twitter:creator" content="@HuluSira" />
        </Head>
        <body>
          <Main />
          <NextScript />

          <script src="https://www.gstatic.com/firebasejs/7.0.0/firebase-app.js"></script>

          <script src="https://www.gstatic.com/firebasejs/7.0.0/firebase-analytics.js"></script>
        </body>
      </html>
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
