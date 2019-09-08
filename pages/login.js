import { Fragment, useState } from 'react';
import Router from 'next/router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/styles';
import HSPaper from '../components/hs-paper';
import { Typography, TextField, Button, Fab } from '@material-ui/core';
import api from '../api';
import HSSnackbar from '../components/hs-snackbar';
import { enforceNotAuth } from '../utils/auth';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '100%',
  },
  signinCard: {
    padding: theme.spacing(2),
    maxWidth: 400,
    margin: 'auto',
  },
  signinButton: {
    width: '100% !important',
    marginTop: theme.spacing(1),
  }
}));

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required("Required"),
  password: Yup.string().required("Required"),
});

function Login() {
  const [errorLogin, setErrorLogin] = useState(false);
  const classes = useStyles();
  const handleSubmit = async function(values, actions) {
    setErrorLogin(false);
    try{
      await api.login(values);
      Router.push('/admin');
    } catch(err){
      setErrorLogin(true);
    }
    actions.setSubmitting(false);
  }
  return (
    <Fragment>
    <div className={classes.root} >
      <HSPaper className={classes.signinCard}>
      <Typography variant="h5" align="center">HuluSira</Typography>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={handleSubmit}
      >
        {({values, isSubmitting, handleChange, errors, touched, handleSubmit}) => {
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
              <Fab classes={{root: classes.signinButton}} type="submit" variant="extended" color="primary" disabled={isSubmitting}>Sign In</Fab>
            </form>
          )
        }}
      </Formik>
      
    </HSPaper>
    </div>
    <HSSnackbar
        variant="error"
        message="Login Failed."
        open={errorLogin}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}
        autoHideDuration={3000}
      />
    </Fragment>
  )
}

Login.getInitialProps = function(ctx) {
  enforceNotAuth(ctx);
  return {};
}

export default Login;