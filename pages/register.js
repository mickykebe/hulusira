import { makeStyles, Box, TextField, Fab, Typography } from "@material-ui/core";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import AuthLayout from "../components/auth-layout";
import Layout from "../components/layout";
import HSSnackBar from "../components/hs-snackbar";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import api from "../api";
import redirect from "../utils/redirect";
import PageProgress from "../components/page-progress";

const useStyles = makeStyles((theme) => ({
  registerButton: {
    width: "100% !important",
    marginTop: theme.spacing(1),
  },
  confirmationIcon: {
    color: "green",
    width: 64,
    height: 64,
  },
}));

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string()
    .email()
    .required("Required"),
  password: Yup.string().required("Required"),
});

export default function Register() {
  const classes = useStyles();
  const [registerError, setRegisterError] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleSubmit = async function(values, actions) {
    setRegisterError(false);
    try {
      await api.register(values);
      setShowConfirmation(true);
    } catch (err) {
      setRegisterError(true);
    } finally {
      actions.setSubmitting(false);
    }
  };
  if (showConfirmation) {
    return (
      <Layout>
        <Box
          display="flex"
          justifyContent="center"
          color="text.secondary"
          pt={2}
          alignItems="center"
          maxWidth={600}
          margin="auto">
          <CheckCircleOutlineIcon className={classes.confirmationIcon} />
          <Typography variant="h6" align="center">
            You've successfully registered on $
            {process.env.NEXT_PUBLIC_APP_NAME}. We've emailed you an activation
            link. Use it to sign in.
          </Typography>
        </Box>
      </Layout>
    );
  }
  return (
    <AuthLayout>
      <Formik
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        }}>
        {({
          values,
          isSubmitting,
          handleChange,
          errors,
          touched,
          handleSubmit,
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <TextField
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                error={!!(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                label="First Name"
                margin="normal"
                variant="outlined"
                fullWidth
              />
              <TextField
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                error={!!(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                label="Last Name"
                margin="normal"
                variant="outlined"
                fullWidth
              />
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
                classes={{ root: classes.registerButton }}
                type="submit"
                variant="extended"
                color="primary"
                disabled={isSubmitting}>
                Register
              </Fab>
              {isSubmitting && <PageProgress />}
            </form>
          );
        }}
      </Formik>
      <HSSnackBar
        variant="error"
        message="Registration Failed."
        open={registerError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={() => setRegisterError(false)}
      />
    </AuthLayout>
  );
}

Register.getInitialProps = async function(ctx) {
  const { user } = ctx;

  if (user) {
    redirect(ctx, "/");
  }

  return {};
};
