import React from "react";
import App, ***REMOVED*** Container ***REMOVED*** from "next/app";
import Head from "next/head";
import ***REMOVED*** ThemeProvider ***REMOVED*** from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../components/theme";
import GlobalCss from "../components/global-css";
import "easymde/dist/easymde.min.css";

class MyApp extends App ***REMOVED***
  componentDidMount() ***REMOVED***
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) ***REMOVED***
      jssStyles.parentNode.removeChild(jssStyles);
    ***REMOVED***
    const firebaseConfig = ***REMOVED***
      apiKey: "AIzaSyA_hMtWwxkL6vKM0c8QW7TE58Dvwx1_B9A",
      authDomain: "hulusira-f45f9.firebaseapp.com",
      databaseURL: "https://hulusira-f45f9.firebaseio.com",
      projectId: "hulusira-f45f9",
      storageBucket: "",
      messagingSenderId: "695763028991",
      appId: "1:695763028991:web:205f14c6b037cd8b79b5ca",
      measurementId: "G-885WPTSXM9"
    ***REMOVED***;
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
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
          <Component ***REMOVED***...pageProps***REMOVED*** />
        </ThemeProvider>
      </Container>
    );
  ***REMOVED***
***REMOVED***

export default MyApp;
