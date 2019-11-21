import ***REMOVED*** Box, Button, makeStyles, TextField ***REMOVED*** from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import ***REMOVED*** Formik ***REMOVED*** from "formik";
import * as Yup from "yup";
import HSCard from "./hs-card";
import ***REMOVED*** useState, useEffect ***REMOVED*** from "react";
import ImageDropdown from "./image-dropdown";
import PageProgress from "./page-progress";
import HSSnackBar from "./hs-snackbar";

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

export default function CompanyForm(***REMOVED***
  initialValues = ***REMOVED*** name: "", email: "", logo: "" ***REMOVED***,
  onSubmit,
  disableSaveButton = false
***REMOVED***) ***REMOVED***
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  const [showErrorSubmitting, setShowErrorSubmitting] = useState(false);
  useEffect(() => ***REMOVED***
    files.forEach(file => URL.revokeObjectURL(file.preview));
  ***REMOVED***, [files]);
  const handleSubmit = async function(values, actions) ***REMOVED***
    try ***REMOVED***
      await onSubmit(values, files);
    ***REMOVED*** catch (err) ***REMOVED***
      console.error(err);
      setShowErrorSubmitting(true);
    ***REMOVED***
    actions.setSubmitting(false);
  ***REMOVED***;
  return (
    <Formik
      validationSchema=***REMOVED***validationSchema***REMOVED***
      initialValues=***REMOVED***initialValues***REMOVED***
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
                label="Company Name*"
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
              <ImageDropdown
                preview=***REMOVED***initialValues.logo***REMOVED***
                files=***REMOVED***files***REMOVED***
                onFilesChange=***REMOVED***setFiles***REMOVED***
              />
              <Box display="flex">
                <Box flex="1" />
                <Button
                  type="submit"
                  className=***REMOVED***classes.saveBtn***REMOVED***
                  color="primary"
                  variant="contained"
                  disabled=***REMOVED***isSubmitting || disableSaveButton***REMOVED***
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
  );
***REMOVED***
