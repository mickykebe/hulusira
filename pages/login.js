import { useState } from "react";
import Link from "next/link";
import Router from "next/router";
import Head from "next/head";
import { Formik } from "formik";
import * as Yup from "yup";
import { makeStyles } from "@material-ui/styles";
import {
  Box,
  TextField,
  Fab,
  Link as MuiLink,
  Typography
} from "@material-ui/core";
import TelegramLoginButton from "react-telegram-login";
import api from "../api";
import HSSnackbar from "../components/hs-snackbar";
import redirect from "../utils/redirect";
import AuthLayout from "../components/auth-layout";
import PageProgress from "../components/page-progress";

const useStyles = makeStyles(theme => ({
  telegramBtnContainer: {
    display: "flex",
    justifyContent: "center",
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2)
  },
  signinButton: {
    width: "100% !important",
    marginTop: theme.spacing(1)
  },
  registerLink: {
    fontWeight: 800
  }
}));

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required("Required"),
  password: Yup.string().required("Required")
});

function Login() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);
  const classes = useStyles();
  const handleSubmit = async function(values, actions) {
    setErrorLogin(false);
    try {
      await api.login(values);
      setLoginSuccess(true);
      Router.push("/dashboard/jobs");
    } catch (err) {
      setErrorLogin(true);
    }
    actions.setSubmitting(false);
  };
  const handleTelegramLogin = async function(user) {
    console.log(user);
    try {
      await api.telegramLogin(user);
      Router.push("/dashboard/jobs");
    } catch (err) {
      console.error(err);
      setErrorLogin(true);
    }
  };
  return (
    <AuthLayout>
      <TelegramLoginButton
        className={classes.telegramBtnContainer}
        dataOnauth={handleTelegramLogin}
        botName="HuluSiraBot"
      />
      <Typography variant="subtitle1" align="center">
        OR
      </Typography>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          email: "",
          password: ""
        }}
        onSubmit={handleSubmit}
      >
        {({
          values,
          isSubmitting,
          handleChange,
          errors,
          touched,
          handleSubmit
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <TextField
                name="email"
                value={values.email}
                onChange={handleChange}
                error={!!(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                label="Email"
                margin="normal"
                variant="outlined"
                fullWidth
              />
              <TextField
                name="password"
                value={values.password}
                onChange={handleChange}
                error={!!(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                fullWidth
              />
              <Fab
                classes={{ root: classes.signinButton }}
                type="submit"
                variant="extended"
                color="primary"
                disabled={isSubmitting || loginSuccess}
              >
                Sign In
              </Fab>
              <Box textAlign="right" pt={2} fontSize="1rem">
                <Link href="/register" passHref>
                  <MuiLink classes={{ root: classes.registerLink }}>
                    Register
                  </MuiLink>
                </Link>{" "}
                for an account
              </Box>
              {isSubmitting && <PageProgress />}
            </form>
          );
        }}
      </Formik>
      <HSSnackbar
        variant="error"
        message="Login Failed."
        open={errorLogin}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={() => setErrorLogin(false)}
      />
    </AuthLayout>
  );
}

Login.getInitialProps = async function(ctx) {
  const { user } = ctx;

  if (user) {
    redirect(ctx, "/");
  }

  return {};
};

export default Login;
