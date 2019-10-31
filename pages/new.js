import React from "react";
import Router, ***REMOVED*** useRouter ***REMOVED*** from "next/router";
import Head from "next/head";
import Cookies from "js-cookie";
import ***REMOVED*** Box, Container, TextField, Fab ***REMOVED*** from "@material-ui/core";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";
import SaveIcon from "@material-ui/icons/Save";
import ***REMOVED*** Formik ***REMOVED*** from "formik";
import * as Yup from "yup";
import api from "../api";
import Layout from "../components/layout";
import HSCard from "../components/hs-card";
import JobItem from "../components/job-item";
import HSSnackbar from "../components/hs-snackbar";
import PageProgress from "../components/page-progress";
import ImageDropdown from "../components/image-dropdown";
import redirect from "../utils/redirect";
import JobFormFields from "../components/job-form-fields";

const useStyles = makeStyles(theme => (***REMOVED***
  root: ***REMOVED***
    paddingTop: theme.spacing(1)
  ***REMOVED***,
  form: ***REMOVED***
    display: "flex",
    flexDirection: "column"
  ***REMOVED***,
  headline: ***REMOVED***
    fontWeight: 800
  ***REMOVED***,
  companyDetails: ***REMOVED***
    marginTop: theme.spacing(3)
  ***REMOVED***,
  jobPreview: ***REMOVED***
    marginTop: theme.spacing(3)
  ***REMOVED***,
  postButton: ***REMOVED***
    marginTop: theme.spacing(2)
  ***REMOVED***,
  saveButtonIcon: ***REMOVED***
    marginRight: theme.spacing(1)
  ***REMOVED***
***REMOVED***));

const pageTitle = "Post job on HuluSira";
const pageDescription =
  "Access thousands of job applicants by posting on HuluSira";

const cleanTags = tags =>
  tags.map(tag => tag.trim()).filter(tag => tag.length > 0);

const validationSchema = Yup.object().shape(***REMOVED***
  position: Yup.string().required("Required"),
  jobType: Yup.string().required("Required"),
  primaryTagId: Yup.number()
    .nullable()
    .test(
      "primaryTag-required",
      "Choose at least one tag here or enter a tag in the Extra Tags input below.",
      function(value) ***REMOVED***
        const tags = cleanTags(this.parent.tags);
        if (!tags || tags.length === 0) ***REMOVED***
          return !!value;
        ***REMOVED***
        return true;
      ***REMOVED***
    ),
  tags: Yup.array().test(
    "tags-required",
    "Please enter at least one tag here or choose a tag in the Primary Tag input above.",
    function(value) ***REMOVED***
      const ***REMOVED*** primaryTagId ***REMOVED*** = this.parent;
      if (primaryTagId === null || primaryTagId === undefined) ***REMOVED***
        return value && cleanTags(value).length > 0;
      ***REMOVED***
      return true;
    ***REMOVED***
  ),
  deadline: Yup.date()
    .nullable()
    .default(null),
  description: Yup.string().required("Required"),
  applyEmail: Yup.string()
    .nullable()
    .notRequired()
    .email(),
  companyName: Yup.string().when("hasCompany", ***REMOVED***
    is: true,
    then: Yup.string().required("Required")
  ***REMOVED***),
  companyEmail: Yup.string().when("hasCompany", ***REMOVED***
    is: true,
    then: Yup.string()
      .email()
      .required("Required")
  ***REMOVED***)
***REMOVED***);

const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Temporary"
];

function New(***REMOVED*** primaryTags, user ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  const [files, setFiles] = React.useState([]);
  const [showErrorSubmitting, setShowErrorSubmitting] = React.useState(false);
  React.useEffect(() => ***REMOVED***
    files.forEach(file => URL.revokeObjectURL(file.preview));
  ***REMOVED***, [files]);

  const handleSubmit = async function(values, actions) ***REMOVED***
    let companyLogo = null;
    try ***REMOVED***
      if (values.hasCompany && files.length > 0) ***REMOVED***
        companyLogo = await api.uploadImage(files[0]);
      ***REMOVED***
      const tags = cleanTags(values.tags);
      const primaryTagId =
        values.primaryTagId !== "" ? values.primaryTagId : null;
      const jobData = await api.createJob(***REMOVED***
        ...values,
        tags,
        primaryTagId,
        companyLogo
      ***REMOVED***);
      Cookies.set(jobData.job.slug, jobData.job.adminToken);
      Router.push(`/jobs/$***REMOVED***jobData.job.slug***REMOVED***`);
    ***REMOVED*** catch (err) ***REMOVED***
      console.error(err);
      setShowErrorSubmitting(true);
    ***REMOVED***
    actions.setSubmitting(false);
  ***REMOVED***;
  const router = useRouter();
  const pageUrl = `$***REMOVED***process.env.ROOT_URL***REMOVED***$***REMOVED***router.asPath***REMOVED***`;

  return (
    <Layout user=***REMOVED***user***REMOVED***>
      <Head>
        <title>***REMOVED***pageTitle***REMOVED***</title>
        <meta name="description" content=***REMOVED***pageDescription***REMOVED*** />
        <meta property="og:title" content=***REMOVED***pageTitle***REMOVED*** />
        <meta property="og:url" content=***REMOVED***pageUrl***REMOVED*** />
        <meta property="og:description" content=***REMOVED***pageDescription***REMOVED*** />
        <meta name="twitter:title" content=***REMOVED***pageTitle***REMOVED*** />
        <meta name="twitter:description" content=***REMOVED***pageDescription***REMOVED*** />
        <meta property="twitter:url" content=***REMOVED***pageUrl***REMOVED*** />
      </Head>
      <Container className=***REMOVED***classes.root***REMOVED*** maxWidth="md">
        <Formik
          validationSchema=***REMOVED***validationSchema***REMOVED***
          initialValues=***REMOVED******REMOVED***
            position: "",
            jobType: "",
            companyName: "",
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
            companyEmail: "",
            deadline: null
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
            return (
              <form className=***REMOVED***classes.form***REMOVED*** onSubmit=***REMOVED***handleSubmit***REMOVED***>
                <HSCard title="Job Details">
                  <JobFormFields
                    values=***REMOVED***values***REMOVED***
                    errors=***REMOVED***errors***REMOVED***
                    touched=***REMOVED***touched***REMOVED***
                    handleChange=***REMOVED***handleChange***REMOVED***
                    setFieldValue=***REMOVED***setFieldValue***REMOVED***
                    primaryTags=***REMOVED***primaryTags***REMOVED***
                  />
                </HSCard>
                ***REMOVED***values.hasCompany && (
                  <HSCard
                    className=***REMOVED***classes.companyDetails***REMOVED***
                    title="Company Details">
                    <TextField
                      label="Company Name*"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      name="companyName"
                      value=***REMOVED***values.companyName***REMOVED***
                      onChange=***REMOVED***handleChange***REMOVED***
                      error=***REMOVED***!!(touched.companyName && errors.companyName)***REMOVED***
                      helperText=***REMOVED***touched.companyName && errors.companyName***REMOVED***
                    />
                    <TextField
                      label="Company Email*"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      type="email"
                      name="companyEmail"
                      value=***REMOVED***values.companyEmail***REMOVED***
                      onChange=***REMOVED***handleChange***REMOVED***
                      error=***REMOVED***!!(touched.companyEmail && errors.companyEmail)***REMOVED***
                      helperText=***REMOVED***touched.companyEmail && errors.companyEmail***REMOVED***
                    />
                    <ImageDropdown files=***REMOVED***files***REMOVED*** onFilesChange=***REMOVED***setFiles***REMOVED*** />
                    <Box />
                  </HSCard>
                )***REMOVED***
                <Fab
                  type="submit"
                  variant="extended"
                  color="primary"
                  className=***REMOVED***classes.postButton***REMOVED***
                  disabled=***REMOVED***isSubmitting***REMOVED***>
                  <SaveIcon className=***REMOVED***classes.saveButtonIcon***REMOVED*** />
                  Post your job
                </Fab>
                <JobItem
                  className=***REMOVED***classes.jobPreview***REMOVED***
                  company=***REMOVED***
                    values.hasCompany
                      ? ***REMOVED***
                          logo: files[0] && files[0].preview,
                          name: values.companyName
                        ***REMOVED***
                      : null
                  ***REMOVED***
                  job=***REMOVED******REMOVED***
                    position: values.position || "Position",
                    jobType: values.jobType
                  ***REMOVED******REMOVED***
                  tags=***REMOVED***[
                    ...primaryTags
                      .filter(tag => tag.id === values.primaryTagId)
                      .map(tag => tag.name),
                    ...cleanTags(values.tags)
                  ]***REMOVED***
                  preview
                />
                ***REMOVED***isSubmitting && <PageProgress />***REMOVED***
                <HSSnackbar
                  variant="error"
                  open=***REMOVED***showErrorSubmitting***REMOVED***
                  onClose=***REMOVED***() => setShowErrorSubmitting(false)***REMOVED***
                  message="Couldn't submit data. Please try again later."
                  autoHideDuration=***REMOVED***6000***REMOVED***
                />
              </form>
            );
          ***REMOVED******REMOVED***
        </Formik>
      </Container>
    </Layout>
  );
***REMOVED***

New.getInitialProps = async ctx => ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (user) ***REMOVED***
    redirect(ctx, "/dashboard/jobs/new");
    return ***REMOVED******REMOVED***;
  ***REMOVED***

  const primaryTags = await api.getPrimaryTags(ctx);
  return ***REMOVED*** primaryTags ***REMOVED***;
***REMOVED***;

export default New;
