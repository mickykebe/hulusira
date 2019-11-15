import React from "react";
import App, { Container } from "next/app";
import Head from "next/head";
import Router from 'next/router';
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import api from "../api";
import theme from "../components/theme";
import GlobalCss from "../components/global-css";
import * as gtag from '../lib/gtag';
import "easymde/dist/easymde.min.css";

Router.events.on('routeChangeComplete', url => gtag.pageview(url));

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
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Head>
          <title>HuluSira</title>
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalCss />
          <Component {...pageProps} />
        </ThemeProvider>
      </Container>
    );
  }
}

export default MyApp;
