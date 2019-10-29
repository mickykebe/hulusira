import DashboardLayout from "../../components/dashboard-layout";
import redirect from "../../utils/redirect";
import Router from "next/router";
import {
  Box,
  Button,
  Container,
  makeStyles,
  TextField
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { Formik } from "formik";
import * as Yup from "yup";
import HSCard from "../../components/hs-card";
import { useState } from "react";
import ImageDropdown from "../../components/image-dropdown";
import api from "../../api";
import PageProgress from "../../components/page-progress";
import HSSnackBar from "../../components/hs-snackbar";

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

export default function NewCompany({ user }) {
  const classes = useStyles();
  const [files, setFiles] = useState([]);
  const [showErrorSubmitting, setShowErrorSubmitting] = useState(false);
  const handleSubmit = async function(values, actions) {
    let logo = null;
    try {
      if (files.length > 0) {
        logo = await api.uploadImage(files[0]);
      }
      const company = await api.createCompany({
        ...values,
        logo
      });
      Router.push("/company");
    } catch (err) {
      console.error(err);
      setShowErrorSubmitting(true);
      actions.setSubmitting(false);
    }
  };
  return (
    <DashboardLayout user={user} selectedItem="company">
      <Container maxWidth="md">
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            name: "",
            email: ""
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
                  <ImageDropdown files={files} onFilesChange={setFiles} />
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
      </Container>
    </DashboardLayout>
  );
}

NewCompany.getInitialProps = async function(ctx) {
  const { user } = ctx;

  if (!user) {
    redirect(ctx, "/");
  }

  return {};
};
