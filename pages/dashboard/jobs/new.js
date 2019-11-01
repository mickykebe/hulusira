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
import * as Yup from "yup";
import redirect from "../../../utils/redirect";
import api from "../../../api";
import JobDetailsFormElement from "../../../components/job-details-form-element";
import JobSettingFormElement from "../../../components/job-setting-form-element";
import HSCard from "../../../components/hs-card";
import ***REMOVED*** Fragment ***REMOVED*** from "react";
import CompanyLogo from "../../../components/company-logo";
import Router from "next/router";
import JobPreviewFormElement from "../../../components/job-preview-form-element";
import ***REMOVED*** jobValidationFields ***REMOVED*** from "../../../utils/validation";

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

const validationSchema = Yup.object().shape(***REMOVED***
  ...jobValidationFields,
  companyId: Yup.number()
    .nullable()
    .when("hasCompany", ***REMOVED***
      is: true,
      then: Yup.number().required("Required")
    ***REMOVED***)
***REMOVED***);

export default function DashboardNewJob(***REMOVED*** user, companies, primaryTags ***REMOVED***) ***REMOVED***
  const handleSubmit = () => ***REMOVED******REMOVED***;
  const classes = useStyles();
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED***>
      <Container maxWidth="md" className=***REMOVED***classes.root***REMOVED***>
        <Formik
          validationSchema=***REMOVED***validationSchema***REMOVED***
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
                            value=***REMOVED***values.companyId***REMOVED***
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
