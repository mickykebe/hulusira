import React from "react";
import App, { Container } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../components/theme";
import GlobalCss from "../components/global-css";
import "easymde/dist/easymde.min.css";

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
    window.onload = function() {
      const firebaseConfig = {
        apiKey: "AIzaSyA_hMtWwxkL6vKM0c8QW7TE58Dvwx1_B9A",
        authDomain: "hulusira-f45f9.firebaseapp.com",
        databaseURL: "https://hulusira-f45f9.firebaseio.com",
        projectId: "hulusira-f45f9",
        storageBucket: "",
        messagingSenderId: "695763028991",
        appId: "1:695763028991:web:205f14c6b037cd8b79b5ca",
        measurementId: "G-885WPTSXM9"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();
    };
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
          <Component {...pageProps} />
        </ThemeProvider>
      </Container>
    );
  }
}

export default MyApp;
