import DashboardLayout from "../../components/dashboard-layout";
import redirect from "../../utils/redirect";
import Router from "next/router";
import ***REMOVED***
  Box,
  Button,
  Container,
  makeStyles,
  TextField
***REMOVED*** from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import ***REMOVED*** Formik ***REMOVED*** from "formik";
import * as Yup from "yup";
import HSCard from "../../components/hs-card";
import ***REMOVED*** useState ***REMOVED*** from "react";
import ImageDropdown from "../../components/image-dropdown";
import api from "../../api";
import PageProgress from "../../components/page-progress";
import HSSnackBar from "../../components/hs-snackbar";

const useStyles = makeStyles(theme => (***REMOVED***
  form: ***REMOVED***
    display: "flex",
    flexDirection: "column"
  ***REMOVED***
***REMOVED***));

const validationSchema = Yup.object().shape(***REMOVED***
  name: Yup.string().required("Required"),
  email: Yup.string()
    .email()
    .required("Required")
***REMOVED***);

export default function NewCompany(***REMOVED*** user ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  const [showErrorSubmitting, setShowErrorSubmitting] = useState(false);
  const handleSubmit = async function(values, actions) ***REMOVED***
    let logo = null;
    try ***REMOVED***
      if (files.length > 0) ***REMOVED***
        logo = await api.uploadImage(files[0]);
      ***REMOVED***
      const company = await api.createCompany(***REMOVED***
        ...values,
        logo
      ***REMOVED***);
      Router.push("/company");
    ***REMOVED*** catch (err) ***REMOVED***
      console.error(err);
      setShowErrorSubmitting(true);
      actions.setSubmitting(false);
    ***REMOVED***
  ***REMOVED***;
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED*** selectedItem="company">
      <Container maxWidth="md">
        <Formik
          validationSchema=***REMOVED***validationSchema***REMOVED***
          initialValues=***REMOVED******REMOVED***
            name: "",
            email: ""
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
              <form className=***REMOVED***classes.form***REMOVED*** onSubmit=***REMOVED***handleSubmit***REMOVED***>
                <HSCard title="Company">
                  <TextField
                    label="Company Name"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="name"
                    value=***REMOVED***values.name***REMOVED***
                    onChange=***REMOVED***handleChange***REMOVED***
                    error=***REMOVED***!!(touched.name && errors.name)***REMOVED***
                    helperText=***REMOVED***touched.name && errors.name***REMOVED***
                  />
                  <TextField
                    label="Company Email*"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    type="email"
                    name="email"
                    value=***REMOVED***values.email***REMOVED***
                    onChange=***REMOVED***handleChange***REMOVED***
                    error=***REMOVED***!!(touched.email && errors.email)***REMOVED***
                    helperText=***REMOVED***touched.email && errors.email***REMOVED***
                  />
                  <ImageDropdown files=***REMOVED***files***REMOVED*** onFilesChange=***REMOVED***setFiles***REMOVED*** />
                  <Box display="flex">
                    <Box flex="1" />
                    <Button
                      type="submit"
                      className=***REMOVED***classes.saveBtn***REMOVED***
                      color="primary"
                      variant="contained"
                      disabled=***REMOVED***isSubmitting***REMOVED***
                      startIcon=***REMOVED***<SaveIcon />***REMOVED***>
                      Save
                    </Button>
                  </Box>
                </HSCard>
                ***REMOVED***isSubmitting && <PageProgress />***REMOVED***
                <HSSnackBar
                  variant="error"
                  open=***REMOVED***showErrorSubmitting***REMOVED***
                  onClose=***REMOVED***() => setShowErrorSubmitting(false)***REMOVED***
                  message="Problem occurred submitting data. Please try again later."
                  autoHideDuration=***REMOVED***5000***REMOVED***
                />
              </form>
            );
          ***REMOVED******REMOVED***
        </Formik>
      </Container>
    </DashboardLayout>
  );
***REMOVED***

NewCompany.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (!user) ***REMOVED***
    redirect(ctx, "/");
  ***REMOVED***

  return ***REMOVED******REMOVED***;
***REMOVED***;
