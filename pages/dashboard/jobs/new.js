import { Formik } from "formik";
import DashboardLayout from "../../../components/dashboard-layout";
import {
  Container,
  makeStyles,
  Button,
  Box,
  TextField,
  MenuItem,
  Typography,
  Collapse,
  Fab
} from "@material-ui/core";
import BusinessIcon from "@material-ui/icons/Business";
import SaveIcon from "@material-ui/icons/Save";
import redirect from "../../../utils/redirect";
import api from "../../../api";
import JobDetailsFormElement from "../../../components/job-details-form-element";
import JobSettingFormElement from "../../../components/job-setting-form-element";
import HSCard from "../../../components/hs-card";
import { Fragment, useState } from "react";
import CompanyLogo from "../../../components/company-logo";
import Router from "next/router";
import JobPreviewFormElement from "../../../components/job-preview-form-element";
import { jobValidationSchema } from "../../../utils/validation";
import { cleanTags } from "../../../utils";
import PageProgress from "../../../components/page-progress";
import HSSnackBar from "../../../components/hs-snackbar";

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(2)
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  jobSetting: {
    marginBottom: theme.spacing(3)
  },
  companyPanel: {
    marginBottom: theme.spacing(3)
  },
  orText: {
    marginBottom: theme.spacing(1)
  },
  postButton: {
    marginTop: theme.spacing(1)
  },
  saveButtonIcon: {
    marginRight: theme.spacing(1)
  },
  jobPreview: {
    marginTop: theme.spacing(3)
  }
}));

export default function DashboardNewJob({ user, companies, primaryTags }) {
  const [showErrorSubmitting, setShowErrorSubmitting] = useState(false);
  const handleSubmit = async function(values, actions) {
    try {
      const tags = cleanTags(values.tags);
      const primaryTagId =
        values.primaryTagId !== "" ? values.primaryTagId : null;
      await api.createJob({
        ...values,
        tags,
        primaryTagId
      });
      Router.push("/dashboard/jobs");
    } catch (err) {
      console.error(err);
      setShowErrorSubmitting(true);
      actions.setSubmitting(false);
    }
  };
  const classes = useStyles();
  return (
    <DashboardLayout user={user}>
      <Container maxWidth="md" className={classes.root}>
        <Formik
          validationSchema={jobValidationSchema}
          initialValues={{
            position: "",
            jobType: "",
            hasCompany: true,
            location: "Addis Ababa",
            primaryTagId: "",
            tags: [],
            salary: "",
            description: "",
            requirements: "",
            responsibilites: "",
            howToApply: "",
            applyUrl: "",
            applyEmail: "",
            deadline: null,
            companyId: null
          }}
          onSubmit={handleSubmit}>
          {({
            values,
            isSubmitting,
            handleChange,
            errors,
            touched,
            setFieldValue,
            handleSubmit
          }) => {
            const selectedCompany = values.companyId
              ? companies.find(company => company.id === values.companyId)
              : null;
            return (
              <form className={classes.form} onSubmit={handleSubmit}>
                <JobSettingFormElement
                  className={classes.jobSetting}
                  values={values}
                  setFieldValue={setFieldValue}
                />
                <Collapse in={values.hasCompany} unmountOnExit>
                  <HSCard title="Company" className={classes.companyPanel}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center">
                      {companies.length > 0 && (
                        <Fragment>
                          <TextField
                            select
                            name="companyId"
                            label="Company"
                            margin="normal"
                            variant="outlined"
                            fullWidth
                            value={values.companyId || ""}
                            onChange={handleChange}
                            error={!!(touched.companyId && errors.companyId)}
                            helperText={touched.companyId && errors.companyId}>
                            {companies.map(company => (
                              <MenuItem key={company.id} value={company.id}>
                                <Box display="flex" alignItems="center">
                                  {company.logo && (
                                    <Box pr={1}>
                                      <CompanyLogo
                                        company={company}
                                        abbrevFallback={false}
                                        size="small"
                                      />
                                    </Box>
                                  )}
                                  {company.name}
                                </Box>
                              </MenuItem>
                            ))}
                          </TextField>
                          <Typography
                            variant="subtitle1"
                            align="center"
                            className={classes.orText}>
                            OR
                          </Typography>
                        </Fragment>
                      )}
                      <Button
                        color="primary"
                        variant="contained"
                        startIcon={<BusinessIcon />}
                        onClick={() => Router.push("/company/new")}>
                        Add Company
                      </Button>
                    </Box>
                  </HSCard>
                </Collapse>
                <JobDetailsFormElement
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                  primaryTags={primaryTags}
                />
                <Fab
                  type="submit"
                  variant="extended"
                  color="primary"
                  className={classes.postButton}
                  disabled={isSubmitting}>
                  <SaveIcon className={classes.saveButtonIcon} />
                  Save
                </Fab>
                <JobPreviewFormElement
                  className={classes.jobPreview}
                  values={values}
                  company={selectedCompany}
                  primaryTags={primaryTags}
                />
                {isSubmitting && <PageProgress />}
                <HSSnackBar
                  variant="error"
                  open={showErrorSubmitting}
                  onClose={() => setShowErrorSubmitting(false)}
                  message="Couldn't submit data. Please try again later."
                  autoHideDuration={3000}
                />
              </form>
            );
          }}
        </Formik>
      </Container>
    </DashboardLayout>
  );
}

DashboardNewJob.getInitialProps = async function(ctx) {
  const { user } = ctx;

  if (!user) {
    redirect(ctx, "/new");
  }

  const [companies, primaryTags] = await Promise.all([
    api.getCompanies(ctx),
    api.getPrimaryTags(ctx)
  ]);
  return { companies, primaryTags };
};
