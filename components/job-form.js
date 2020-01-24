import {
  makeStyles,
  Collapse,
  Box,
  TextField,
  MenuItem,
  Typography,
  Button,
  Fab
} from "@material-ui/core";
import BusinessIcon from "@material-ui/icons/Business";
import SaveIcon from "@material-ui/icons/Save";
import { useState, Fragment } from "react";
import { Formik } from "formik";
import { jobValidationSchema } from "../utils/validation";
import JobSettingFormElement from "./job-setting-form-element";
import HSCard from "./hs-card";
import CompanyLogo from "./company-logo";
import JobDetailsFormElement from "./job-details-form-element";
import JobPreviewFormElement from "./job-preview-form-element";
import PageProgress from "./page-progress";
import HSSnackBar from "./hs-snackbar";
import Router from "next/router";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import add from "date-fns/add";

const useStyles = makeStyles(theme => ({
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
  jobDetailsCard: {
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

function DateTimePickerTextField(props) {
  return <TextField margin="normal" fullWidth {...props} />;
}

export default function JobForm({
  initialValues = {
    position: "",
    jobType: "",
    careerLevel: "",
    hasCompany: true,
    location: "Addis Ababa",
    primaryTag: "",
    tags: [],
    salary: "",
    description: "",
    requirements: "",
    responsibilities: "",
    howToApply: "",
    applyUrl: "",
    applyEmail: "",
    deadline: null,
    companyId: null,
    socialPostScheduleTime: null
  },
  companies,
  primaryTags,
  onSubmit,
  disableSaveButton = false,
  user
}) {
  const classes = useStyles();
  const [showErrorSubmitting, setShowErrorSubmitting] = useState(false);
  const handleSubmit = async function(values, actions) {
    try {
      await onSubmit(values);
    } catch (err) {
      console.error(err);
      setShowErrorSubmitting(true);
      actions.setSubmitting(false);
    }
    actions.setSubmitting(false);
  };
  return (
    <Formik
      validationSchema={jobValidationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
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
                <Box display="flex" flexDirection="column" alignItems="center">
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
                        helperText={touched.companyId && errors.companyId}
                      >
                        {companies.map(company => (
                          <MenuItem key={company.id} value={company.id}>
                            <Box display="flex" alignItems="center">
                              {company.logo && (
                                <Box pr={1}>
                                  <CompanyLogo
                                    company={company}
                                    abbrevFallback={false}
                                    size="extraSmall"
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
                        className={classes.orText}
                      >
                        OR
                      </Typography>
                    </Fragment>
                  )}
                  <Button
                    color="primary"
                    variant="contained"
                    startIcon={<BusinessIcon />}
                    onClick={() => Router.push("/dashboard/companies/new")}
                  >
                    Add Company
                  </Button>
                </Box>
              </HSCard>
            </Collapse>
            <JobDetailsFormElement
              className={classes.jobDetailsCard}
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              primaryTags={primaryTags}
            />
            {user.role === "admin" && (
              <HSCard title="Facebook post schedule">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DateTimePicker
                    label="Schedule time"
                    inputVariant="outlined"
                    value={
                      values.socialPostScheduleTime &&
                      new Date(values.socialPostScheduleTime * 1000)
                    }
                    onChange={date => {
                      const inSeconds = parseInt(date.getTime() / 1000);
                      setFieldValue("socialPostScheduleTime", inSeconds);
                    }}
                    TextFieldComponent={DateTimePickerTextField}
                    minDate={add(new Date(), { minutes: 20 })}
                    minDateMessage="Can't schedule for that time. Please move it forward."
                  />
                </MuiPickersUtilsProvider>
              </HSCard>
            )}
            <Fab
              type="submit"
              variant="extended"
              color="primary"
              className={classes.postButton}
              disabled={isSubmitting || disableSaveButton}
            >
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
  );
}
