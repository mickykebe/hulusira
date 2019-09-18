import ***REMOVED*** Fragment, useState ***REMOVED*** from "react";
import Router from "next/router";
import nextCookie from "next-cookies";
import ***REMOVED*** Formik ***REMOVED*** from "formik";
import * as Yup from "yup";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";
import HSPaper from "../components/hs-paper";
import ***REMOVED*** Typography, TextField, Fab ***REMOVED*** from "@material-ui/core";
import api from "../api";
import HSSnackbar from "../components/hs-snackbar";
import redirect from "../utils/redirect";

const useStyles = makeStyles(theme => (***REMOVED***
  root: ***REMOVED***
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "100%",
    padding: `0 $***REMOVED***theme.spacing(2)***REMOVED***px`
  ***REMOVED***,
  signinCard: ***REMOVED***
    padding: theme.spacing(2),
    maxWidth: 400,
    margin: "auto"
  ***REMOVED***,
  signinButton: ***REMOVED***
    width: "100% !important",
    marginTop: theme.spacing(1)
  ***REMOVED***
***REMOVED***));

const validationSchema = Yup.object().shape(***REMOVED***
  email: Yup.string()
    .email()
    .required("Required"),
  password: Yup.string().required("Required")
***REMOVED***);

function Login() ***REMOVED***
  const [errorLogin, setErrorLogin] = useState(false);
  const classes = useStyles();
  const handleSubmit = async function(values, actions) ***REMOVED***
    setErrorLogin(false);
    try ***REMOVED***
      await api.login(values);
      Router.push("/pending-jobs");
    ***REMOVED*** catch (err) ***REMOVED***
      setErrorLogin(true);
    ***REMOVED***
    actions.setSubmitting(false);
  ***REMOVED***;
  return (
    <Fragment>
      <div className=***REMOVED***classes.root***REMOVED***>
        <HSPaper className=***REMOVED***classes.signinCard***REMOVED***>
          <Typography variant="h5" align="center">
            HuluSira
          </Typography>
          <Formik
            validationSchema=***REMOVED***validationSchema***REMOVED***
            initialValues=***REMOVED******REMOVED***
              email: "",
              password: ""
            ***REMOVED******REMOVED***
            onSubmit=***REMOVED***handleSubmit***REMOVED***>
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
                    disabled=***REMOVED***isSubmitting***REMOVED***>
                    Sign In
                  </Fab>
                </form>
              );
            ***REMOVED******REMOVED***
          </Formik>
        </HSPaper>
      </div>
      <HSSnackbar
        variant="error"
        message="Login Failed."
        open=***REMOVED***errorLogin***REMOVED***
        anchorOrigin=***REMOVED******REMOVED*** vertical: "bottom", horizontal: "center" ***REMOVED******REMOVED***
        autoHideDuration=***REMOVED***3000***REMOVED***
      />
    </Fragment>
  );
***REMOVED***

Login.getInitialProps = async function(ctx) ***REMOVED***
  if (ctx.req) ***REMOVED***
    const ***REMOVED*** qid: sessionId ***REMOVED*** = nextCookie(ctx);
    if (sessionId) ***REMOVED***
      redirect(ctx, "/");
    ***REMOVED***
    return ***REMOVED******REMOVED***;
  ***REMOVED***

  try ***REMOVED***
    await api.activeUser();
    redirect(ctx, "/");
  ***REMOVED*** finally ***REMOVED***
    return ***REMOVED******REMOVED***;
  ***REMOVED***
***REMOVED***;

export default Login;
