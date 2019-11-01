import ***REMOVED*** Formik ***REMOVED*** from "formik";
import DashboardLayout from "../../../components/dashboard-layout";
import ***REMOVED***
  Container,
  makeStyles,
  Button,
  Box,
  TextField,
  MenuItem,
  Typography,
  Collapse,
  Fab
***REMOVED*** from "@material-ui/core";
import BusinessIcon from "@material-ui/icons/Business";
import SaveIcon from "@material-ui/icons/Save";
import redirect from "../../../utils/redirect";
import api from "../../../api";
import JobDetailsFormElement from "../../../components/job-details-form-element";
import JobSettingFormElement from "../../../components/job-setting-form-element";
import HSCard from "../../../components/hs-card";
import ***REMOVED*** Fragment, useState ***REMOVED*** from "react";
import CompanyLogo from "../../../components/company-logo";
import Router from "next/router";
import JobPreviewFormElement from "../../../components/job-preview-form-element";
import ***REMOVED*** jobValidationSchema ***REMOVED*** from "../../../utils/validation";
import ***REMOVED*** cleanTags ***REMOVED*** from "../../../utils";
import PageProgress from "../../../components/page-progress";
import HSSnackBar from "../../../components/hs-snackbar";

const useStyles = makeStyles(theme => (***REMOVED***
  root: ***REMOVED***
    paddingBottom: theme.spacing(2)
  ***REMOVED***,
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

export default function DashboardNewJob(***REMOVED*** user, companies, primaryTags ***REMOVED***) ***REMOVED***
  const [showErrorSubmitting, setShowErrorSubmitting] = useState(false);
  const handleSubmit = async function(values, actions) ***REMOVED***
    try ***REMOVED***
      const tags = cleanTags(values.tags);
      const primaryTagId =
        values.primaryTagId !== "" ? values.primaryTagId : null;
      await api.createJob(***REMOVED***
        ...values,
        tags,
        primaryTagId
      ***REMOVED***);
      Router.push("/dashboard/jobs");
    ***REMOVED*** catch (err) ***REMOVED***
      console.error(err);
      setShowErrorSubmitting(true);
      actions.setSubmitting(false);
    ***REMOVED***
  ***REMOVED***;
  const classes = useStyles();
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED***>
      <Container maxWidth="md" className=***REMOVED***classes.root***REMOVED***>
        <Formik
          validationSchema=***REMOVED***jobValidationSchema***REMOVED***
          initialValues=***REMOVED******REMOVED***
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
          ***REMOVED******REMOVED***
          onSubmit=***REMOVED***handleSubmit***REMOVED***>
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
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center">
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
                            helperText=***REMOVED***touched.companyId && errors.companyId***REMOVED***>
                            ***REMOVED***companies.map(company => (
                              <MenuItem key=***REMOVED***company.id***REMOVED*** value=***REMOVED***company.id***REMOVED***>
                                <Box display="flex" alignItems="center">
                                  ***REMOVED***company.logo && (
                                    <Box pr=***REMOVED***1***REMOVED***>
                                      <CompanyLogo
                                        company=***REMOVED***company***REMOVED***
                                        abbrevFallback=***REMOVED***false***REMOVED***
                                        size="small"
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
                            className=***REMOVED***classes.orText***REMOVED***>
                            OR
                          </Typography>
                        </Fragment>
                      )***REMOVED***
                      <Button
                        color="primary"
                        variant="contained"
                        startIcon=***REMOVED***<BusinessIcon />***REMOVED***
                        onClick=***REMOVED***() => Router.push("/company/new")***REMOVED***>
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
                  disabled=***REMOVED***isSubmitting***REMOVED***>
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
      </Container>
    </DashboardLayout>
  );
***REMOVED***

DashboardNewJob.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (!user) ***REMOVED***
    redirect(ctx, "/new");
  ***REMOVED***

  const [companies, primaryTags] = await Promise.all([
    api.getCompanies(ctx),
    api.getPrimaryTags(ctx)
  ]);
  return ***REMOVED*** companies, primaryTags ***REMOVED***;
***REMOVED***;
