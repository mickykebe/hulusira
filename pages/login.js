import { useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { Formik } from "formik";
import * as Yup from "yup";
import { makeStyles } from "@material-ui/styles";
import { Box, TextField, Fab, Link as MuiLink } from "@material-ui/core";
import api from "../api";
import HSSnackbar from "../components/hs-snackbar";
import redirect from "../utils/redirect";
import AuthLayout from "../components/auth-layout";
import PageProgress from "../components/page-progress";

const useStyles = makeStyles(theme => ({
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
  const [errorLogin, setErrorLogin] = useState(false);
  const classes = useStyles();
  const handleSubmit = async function(values, actions) {
    setErrorLogin(false);
    try {
      await api.login(values);
      Router.push("/dashboard/jobs");
    } catch (err) {
      setErrorLogin(true);
      actions.setSubmitting(false);
    }
  };
  return (
    <AuthLayout>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          email: "",
          password: ""
        }}
        onSubmit={handleSubmit}>
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
                disabled={isSubmitting}>
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
