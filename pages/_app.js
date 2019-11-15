import React from "react";
import App, ***REMOVED*** Container ***REMOVED*** from "next/app";
import Head from "next/head";
import Router from 'next/router';
import ***REMOVED*** ThemeProvider ***REMOVED*** from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import api from "../api";
import theme from "../components/theme";
import GlobalCss from "../components/global-css";
import * as gtag from '../lib/gtag';
import "easymde/dist/easymde.min.css";

Router.events.on('routeChangeComplete', url => gtag.pageview(url));

class MyApp extends App ***REMOVED***
  static async getInitialProps(***REMOVED*** Component, ctx ***REMOVED***) ***REMOVED***
    let user;
    let pageProps = ***REMOVED******REMOVED***;
    try ***REMOVED***
      user = await api.activeUser(ctx);
    ***REMOVED*** catch (err) ***REMOVED***
      user = null;
    ***REMOVED***
    ctx.user = user;
    if (Component.getInitialProps) ***REMOVED***
      pageProps = await Component.getInitialProps(ctx);
    ***REMOVED***
    return ***REMOVED*** pageProps: ***REMOVED*** user, ...pageProps ***REMOVED*** ***REMOVED***;
  ***REMOVED***

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
          <title>HuluSira</title>
        </Head>
        <ThemeProvider theme=***REMOVED***theme***REMOVED***>
          <CssBaseline />
          <GlobalCss />
          <Component ***REMOVED***...pageProps***REMOVED*** />
        </ThemeProvider>
      </Container>
    );
  ***REMOVED***
***REMOVED***

export default MyApp;
