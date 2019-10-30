import { Box, Button, makeStyles, TextField } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { Formik } from "formik";
import * as Yup from "yup";
import HSCard from "./hs-card";
import { useState } from "react";
import ImageDropdown from "./image-dropdown";
import PageProgress from "./page-progress";
import HSSnackBar from "./hs-snackbar";

const useStyles = makeStyles(theme => ({
  form: {
    display: "flex",
    flexDirection: "column"
  }
}));

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string()
    .email()
    .required("Required")
});

export default function CompanyForm({
  initialValues = { name: "", email: "" },
  onSubmit
}) {
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  const [showErrorSubmitting, setShowErrorSubmitting] = useState(false);
  const handleSubmit = async function(values, actions) {
    try {
      await onSubmit(values, files);
    } catch (err) {
      console.error(err);
      setShowErrorSubmitting(true);
      actions.setSubmitting(false);
    }
  };
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
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
          <form className={classes.form} onSubmit={handleSubmit}>
            <HSCard title="Company">
              <TextField
                label="Company Name"
                variant="outlined"
                margin="normal"
                fullWidth
                name="name"
                value={values.name}
                onChange={handleChange}
                error={!!(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
              <TextField
                label="Company Email*"
                variant="outlined"
                margin="normal"
                fullWidth
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                error={!!(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
              <ImageDropdown
                preview={initialValues.logo}
                files={files}
                onFilesChange={setFiles}
              />
              <Box display="flex">
                <Box flex="1" />
                <Button
                  type="submit"
                  className={classes.saveBtn}
                  color="primary"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={<SaveIcon />}>
                  Save
                </Button>
              </Box>
            </HSCard>
            {isSubmitting && <PageProgress />}
            <HSSnackBar
              variant="error"
              open={showErrorSubmitting}
              onClose={() => setShowErrorSubmitting(false)}
              message="Problem occurred submitting data. Please try again later."
              autoHideDuration={5000}
            />
          </form>
        );
      }}
    </Formik>
  );
}
