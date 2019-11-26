import ***REMOVED*** useState ***REMOVED*** from "react";
import Link from "next/link";
import Router from "next/router";
import Head from "next/head";
import ***REMOVED*** Formik ***REMOVED*** from "formik";
import * as Yup from "yup";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";
import ***REMOVED***
  Box,
  TextField,
  Fab,
  Link as MuiLink,
  Typography
***REMOVED*** from "@material-ui/core";
import TelegramLoginButton from "react-telegram-login";
import api from "../api";
import HSSnackbar from "../components/hs-snackbar";
import redirect from "../utils/redirect";
import AuthLayout from "../components/auth-layout";
import PageProgress from "../components/page-progress";

const useStyles = makeStyles(theme => (***REMOVED***
  telegramBtnContainer: ***REMOVED***
    display: "flex",
    justifyContent: "center",
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2)
  ***REMOVED***,
  signinButton: ***REMOVED***
    width: "100% !important",
    marginTop: theme.spacing(1)
  ***REMOVED***,
  registerLink: ***REMOVED***
    fontWeight: 800
  ***REMOVED***
***REMOVED***));

const validationSchema = Yup.object().shape(***REMOVED***
  email: Yup.string()
    .email()
    .required("Required"),
  password: Yup.string().required("Required")
***REMOVED***);

function Login() ***REMOVED***
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);
  const classes = useStyles();
  const handleSubmit = async function(values, actions) ***REMOVED***
    setErrorLogin(false);
    try ***REMOVED***
      await api.login(values);
      setLoginSuccess(true);
      Router.push("/dashboard/jobs");
    ***REMOVED*** catch (err) ***REMOVED***
      setErrorLogin(true);
    ***REMOVED***
    actions.setSubmitting(false);
  ***REMOVED***;
  const handleTelegramLogin = async function(user) ***REMOVED***
    console.log(user);
    try ***REMOVED***
      await api.telegramLogin(user);
      Router.push("/dashboard/jobs");
    ***REMOVED*** catch (err) ***REMOVED***
      console.error(err);
      setErrorLogin(true);
    ***REMOVED***
  ***REMOVED***;
  return (
    <AuthLayout>
      <TelegramLoginButton
        className=***REMOVED***classes.telegramBtnContainer***REMOVED***
        dataOnauth=***REMOVED***handleTelegramLogin***REMOVED***
        botName="HuluSiraBot"
      />
      <Typography variant="subtitle1" align="center">
        OR
      </Typography>
      <Formik
        validationSchema=***REMOVED***validationSchema***REMOVED***
        initialValues=***REMOVED******REMOVED***
          email: "",
          password: ""
        ***REMOVED******REMOVED***
        onSubmit=***REMOVED***handleSubmit***REMOVED***
      >
        ***REMOVED***(***REMOVED***
          values,
          isSubmitting,
          handleChange,
          errors,
          touched,
          handleSubmit
        ***REMOVED***) => ***REMOVED***
          return (
            <form onSubmit=***REMOVED***handleSubmit***REMOVED***>
              <TextField
                name="email"
                value=***REMOVED***values.email***REMOVED***
                onChange=***REMOVED***handleChange***REMOVED***
                error=***REMOVED***!!(touched.email && errors.email)***REMOVED***
                helperText=***REMOVED***touched.email && errors.email***REMOVED***
                label="Email"
                margin="normal"
                variant="outlined"
                fullWidth
              />
              <TextField
                name="password"
                value=***REMOVED***values.password***REMOVED***
                onChange=***REMOVED***handleChange***REMOVED***
                error=***REMOVED***!!(touched.password && errors.password)***REMOVED***
                helperText=***REMOVED***touched.password && errors.password***REMOVED***
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                fullWidth
              />
              <Fab
                classes=***REMOVED******REMOVED*** root: classes.signinButton ***REMOVED******REMOVED***
                type="submit"
                variant="extended"
                color="primary"
                disabled=***REMOVED***isSubmitting || loginSuccess***REMOVED***
              >
                Sign In
              </Fab>
              <Box textAlign="right" pt=***REMOVED***2***REMOVED*** fontSize="1rem">
                <Link href="/register" passHref>
                  <MuiLink classes=***REMOVED******REMOVED*** root: classes.registerLink ***REMOVED******REMOVED***>
                    Register
                  </MuiLink>
                </Link>***REMOVED***" "***REMOVED***
                for an account
              </Box>
              ***REMOVED***isSubmitting && <PageProgress />***REMOVED***
            </form>
          );
        ***REMOVED******REMOVED***
      </Formik>
      <HSSnackbar
        variant="error"
        message="Login Failed."
        open=***REMOVED***errorLogin***REMOVED***
        anchorOrigin=***REMOVED******REMOVED*** vertical: "bottom", horizontal: "center" ***REMOVED******REMOVED***
        autoHideDuration=***REMOVED***3000***REMOVED***
        onClose=***REMOVED***() => setErrorLogin(false)***REMOVED***
      />
    </AuthLayout>
  );
***REMOVED***

Login.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (user) ***REMOVED***
    redirect(ctx, "/");
  ***REMOVED***

  return ***REMOVED******REMOVED***;
***REMOVED***;

export default Login;
