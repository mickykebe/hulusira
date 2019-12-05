import ***REMOVED***
  makeStyles,
  Collapse,
  Box,
  TextField,
  MenuItem,
  Typography,
  Button,
  Fab
***REMOVED*** from "@material-ui/core";
import BusinessIcon from "@material-ui/icons/Business";
import SaveIcon from "@material-ui/icons/Save";
import ***REMOVED*** useState, Fragment ***REMOVED*** from "react";
import ***REMOVED*** Formik ***REMOVED*** from "formik";
import ***REMOVED*** jobValidationSchema ***REMOVED*** from "../utils/validation";
import JobSettingFormElement from "./job-setting-form-element";
import HSCard from "./hs-card";
import CompanyLogo from "./company-logo";
import JobDetailsFormElement from "./job-details-form-element";
import JobPreviewFormElement from "./job-preview-form-element";
import PageProgress from "./page-progress";
import HSSnackBar from "./hs-snackbar";
import Router from "next/router";

const useStyles = makeStyles(theme => (***REMOVED***
  form: ***REMOVED***
    display: "flex",
    flexDirection: "column"
  ***REMOVED***,
  jobSetting: ***REMOVED***
    marginBottom: theme.spacing(3)
  ***REMOVED***,
  companyPanel: ***REMOVED***
    marginBottom: theme.spacing(3)
  ***REMOVED***,
  orText: ***REMOVED***
    marginBottom: theme.spacing(1)
  ***REMOVED***,
  postButton: ***REMOVED***
    marginTop: theme.spacing(1)
  ***REMOVED***,
  saveButtonIcon: ***REMOVED***
    marginRight: theme.spacing(1)
  ***REMOVED***,
  jobPreview: ***REMOVED***
    marginTop: theme.spacing(3)
  ***REMOVED***
***REMOVED***));

export default function JobForm(***REMOVED***
  initialValues = ***REMOVED***
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
    companyId: null
  ***REMOVED***,
  companies,
  primaryTags,
  onSubmit,
  disableSaveButton = false
***REMOVED***) ***REMOVED***
  const classes = useStyles();
  const [showErrorSubmitting, setShowErrorSubmitting] = useState(false);
  const handleSubmit = async function(values, actions) ***REMOVED***
    try ***REMOVED***
      await onSubmit(values);
    ***REMOVED*** catch (err) ***REMOVED***
      console.error(err);
      setShowErrorSubmitting(true);
      actions.setSubmitting(false);
    ***REMOVED***
    actions.setSubmitting(false);
  ***REMOVED***;
  return (
    <Formik
      validationSchema=***REMOVED***jobValidationSchema***REMOVED***
      initialValues=***REMOVED***initialValues***REMOVED***
      onSubmit=***REMOVED***handleSubmit***REMOVED***
    >
      ***REMOVED***(***REMOVED***
        values,
        isSubmitting,
        handleChange,
        errors,
        touched,
        setFieldValue,
        handleSubmit
      ***REMOVED***) => ***REMOVED***
        const selectedCompany = values.companyId
          ? companies.find(company => company.id === values.companyId)
          : null;
        return (
          <form className=***REMOVED***classes.form***REMOVED*** onSubmit=***REMOVED***handleSubmit***REMOVED***>
            <JobSettingFormElement
              className=***REMOVED***classes.jobSetting***REMOVED***
              values=***REMOVED***values***REMOVED***
              setFieldValue=***REMOVED***setFieldValue***REMOVED***
            />
            <Collapse in=***REMOVED***values.hasCompany***REMOVED*** unmountOnExit>
              <HSCard title="Company" className=***REMOVED***classes.companyPanel***REMOVED***>
                <Box display="flex" flexDirection="column" alignItems="center">
                  ***REMOVED***companies.length > 0 && (
                    <Fragment>
                      <TextField
                        select
                        name="companyId"
                        label="Company"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        value=***REMOVED***values.companyId || ""***REMOVED***
                        onChange=***REMOVED***handleChange***REMOVED***
                        error=***REMOVED***!!(touched.companyId && errors.companyId)***REMOVED***
                        helperText=***REMOVED***touched.companyId && errors.companyId***REMOVED***
                      >
                        ***REMOVED***companies.map(company => (
                          <MenuItem key=***REMOVED***company.id***REMOVED*** value=***REMOVED***company.id***REMOVED***>
                            <Box display="flex" alignItems="center">
                              ***REMOVED***company.logo && (
                                <Box pr=***REMOVED***1***REMOVED***>
                                  <CompanyLogo
                                    company=***REMOVED***company***REMOVED***
                                    abbrevFallback=***REMOVED***false***REMOVED***
                                    size="extraSmall"
                                  />
                                </Box>
                              )***REMOVED***
                              ***REMOVED***company.name***REMOVED***
                            </Box>
                          </MenuItem>
                        ))***REMOVED***
                      </TextField>
                      <Typography
                        variant="subtitle1"
                        align="center"
                        className=***REMOVED***classes.orText***REMOVED***
                      >
                        OR
                      </Typography>
                    </Fragment>
                  )***REMOVED***
                  <Button
                    color="primary"
                    variant="contained"
                    startIcon=***REMOVED***<BusinessIcon />***REMOVED***
                    onClick=***REMOVED***() => Router.push("/dashboard/companies/new")***REMOVED***
                  >
                    Add Company
                  </Button>
                </Box>
              </HSCard>
            </Collapse>
            <JobDetailsFormElement
              values=***REMOVED***values***REMOVED***
              errors=***REMOVED***errors***REMOVED***
              touched=***REMOVED***touched***REMOVED***
              handleChange=***REMOVED***handleChange***REMOVED***
              setFieldValue=***REMOVED***setFieldValue***REMOVED***
              primaryTags=***REMOVED***primaryTags***REMOVED***
            />
            <Fab
              type="submit"
              variant="extended"
              color="primary"
              className=***REMOVED***classes.postButton***REMOVED***
              disabled=***REMOVED***isSubmitting || disableSaveButton***REMOVED***
            >
              <SaveIcon className=***REMOVED***classes.saveButtonIcon***REMOVED*** />
              Save
            </Fab>
            <JobPreviewFormElement
              className=***REMOVED***classes.jobPreview***REMOVED***
              values=***REMOVED***values***REMOVED***
              company=***REMOVED***selectedCompany***REMOVED***
              primaryTags=***REMOVED***primaryTags***REMOVED***
            />
            ***REMOVED***isSubmitting && <PageProgress />***REMOVED***
            <HSSnackBar
              variant="error"
              open=***REMOVED***showErrorSubmitting***REMOVED***
              onClose=***REMOVED***() => setShowErrorSubmitting(false)***REMOVED***
              message="Couldn't submit data. Please try again later."
              autoHideDuration=***REMOVED***3000***REMOVED***
            />
          </form>
        );
      ***REMOVED******REMOVED***
    </Formik>
  );
***REMOVED***
