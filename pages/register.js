import ***REMOVED*** makeStyles, Box, TextField, Fab, Typography ***REMOVED*** from "@material-ui/core";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import AuthLayout from "../components/auth-layout";
import Layout from "../components/layout";
import HSSnackBar from "../components/hs-snackbar";
import ***REMOVED*** Formik ***REMOVED*** from "formik";
import * as Yup from "yup";
import ***REMOVED*** useState ***REMOVED*** from "react";
import api from "../api";
import redirect from "../utils/redirect";
import PageProgress from "../components/page-progress";

const useStyles = makeStyles(theme => (***REMOVED***
  registerButton: ***REMOVED***
    width: "100% !important",
    marginTop: theme.spacing(1)
  ***REMOVED***,
  confirmationIcon: ***REMOVED***
    color: "green",
    width: 64,
    height: 64
  ***REMOVED***
***REMOVED***));

const validationSchema = Yup.object().shape(***REMOVED***
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string()
    .email()
    .required("Required"),
  password: Yup.string().required("Required")
***REMOVED***);

export default function Register() ***REMOVED***
  const classes = useStyles();
  const [registerError, setRegisterError] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleSubmit = async function(values, actions) ***REMOVED***
    setRegisterError(false);
    try ***REMOVED***
      await api.register(values);
      setShowConfirmation(true);
    ***REMOVED*** catch (err) ***REMOVED***
      setRegisterError(true);
    ***REMOVED*** finally ***REMOVED***
      actions.setSubmitting(false);
    ***REMOVED***
  ***REMOVED***;
  if (showConfirmation) ***REMOVED***
    return (
      <Layout>
        <Box
          display="flex"
          justifyContent="center"
          color="text.secondary"
          pt=***REMOVED***2***REMOVED***
          alignItems="center"
          maxWidth=***REMOVED***600***REMOVED***
          margin="auto">
          <CheckCircleOutlineIcon className=***REMOVED***classes.confirmationIcon***REMOVED*** />
          <Typography variant="h6" align="center">
            You've successfully registered on HuluSira. We've emailed you an
            activation link. Use it to sign in.
          </Typography>
        </Box>
      </Layout>
    );
  ***REMOVED***
  return (
    <AuthLayout>
      <Formik
        validationSchema=***REMOVED***validationSchema***REMOVED***
        onSubmit=***REMOVED***handleSubmit***REMOVED***
        initialValues=***REMOVED******REMOVED***
          firstName: "",
          lastName: "",
          email: "",
          password: ""
        ***REMOVED******REMOVED***>
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
                name="firstName"
                value=***REMOVED***values.firstName***REMOVED***
                onChange=***REMOVED***handleChange***REMOVED***
                error=***REMOVED***!!(touched.firstName && errors.firstName)***REMOVED***
                helperText=***REMOVED***touched.firstName && errors.firstName***REMOVED***
                label="First Name"
                margin="normal"
                variant="outlined"
                fullWidth
              />
              <TextField
                name="lastName"
                value=***REMOVED***values.lastName***REMOVED***
                onChange=***REMOVED***handleChange***REMOVED***
                error=***REMOVED***!!(touched.lastName && errors.lastName)***REMOVED***
                helperText=***REMOVED***touched.lastName && errors.lastName***REMOVED***
                label="Last Name"
                margin="normal"
                variant="outlined"
                fullWidth
              />
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
                classes=***REMOVED******REMOVED*** root: classes.registerButton ***REMOVED******REMOVED***
                type="submit"
                variant="extended"
                color="primary"
                disabled=***REMOVED***isSubmitting***REMOVED***>
                Register
              </Fab>
              ***REMOVED***isSubmitting && <PageProgress />***REMOVED***
            </form>
          );
        ***REMOVED******REMOVED***
      </Formik>
      <HSSnackBar
        variant="error"
        message="Registration Failed."
        open=***REMOVED***registerError***REMOVED***
        anchorOrigin=***REMOVED******REMOVED*** vertical: "bottom", horizontal: "center" ***REMOVED******REMOVED***
        autoHideDuration=***REMOVED***3000***REMOVED***
        onClose=***REMOVED***() => setRegisterError(false)***REMOVED***
      />
    </AuthLayout>
  );
***REMOVED***

Register.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (user) ***REMOVED***
    redirect(ctx, "/");
  ***REMOVED***

  return ***REMOVED******REMOVED***;
***REMOVED***;
