import React from "react";
import App, ***REMOVED*** Container ***REMOVED*** from "next/app";
import Head from "next/head";
import ***REMOVED*** ThemeProvider ***REMOVED*** from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../components/theme";
import "../app.css";

class MyApp extends App ***REMOVED***
  componentDidMount() ***REMOVED***
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) ***REMOVED***
      jssStyles.parentNode.removeChild(jssStyles);
    ***REMOVED***
  ***REMOVED***

  render() ***REMOVED***
    const ***REMOVED*** Component, pageProps ***REMOVED*** = this.props;

    return (
      <Container>
        <Head>
          <title>My page</title>
        </Head>
        <ThemeProvider theme=***REMOVED***theme***REMOVED***>
          <CssBaseline />
          <Component ***REMOVED***...pageProps***REMOVED*** />
        </ThemeProvider>
      </Container>
    );
  ***REMOVED***
***REMOVED***

export default MyApp;
