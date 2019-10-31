import React from "react";
import Router, { useRouter } from "next/router";
import Head from "next/head";
import Cookies from "js-cookie";
import { Box, Container, TextField, Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import SaveIcon from "@material-ui/icons/Save";
import { Formik } from "formik";
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

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(1)
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  headline: {
    fontWeight: 800
  },
  companyDetails: {
    marginTop: theme.spacing(3)
  },
  jobPreview: {
    marginTop: theme.spacing(3)
  },
  postButton: {
    marginTop: theme.spacing(2)
  },
  saveButtonIcon: {
    marginRight: theme.spacing(1)
  }
}));

const pageTitle = "Post job on HuluSira";
const pageDescription =
  "Access thousands of job applicants by posting on HuluSira";

const cleanTags = tags =>
  tags.map(tag => tag.trim()).filter(tag => tag.length > 0);

const validationSchema = Yup.object().shape({
  position: Yup.string().required("Required"),
  jobType: Yup.string().required("Required"),
  primaryTagId: Yup.number()
    .nullable()
    .test(
      "primaryTag-required",
      "Choose at least one tag here or enter a tag in the Extra Tags input below.",
      function(value) {
        const tags = cleanTags(this.parent.tags);
        if (!tags || tags.length === 0) {
          return !!value;
        }
        return true;
      }
    ),
  tags: Yup.array().test(
    "tags-required",
    "Please enter at least one tag here or choose a tag in the Primary Tag input above.",
    function(value) {
      const { primaryTagId } = this.parent;
      if (primaryTagId === null || primaryTagId === undefined) {
        return value && cleanTags(value).length > 0;
      }
      return true;
    }
  ),
  deadline: Yup.date()
    .nullable()
    .default(null),
  description: Yup.string().required("Required"),
  applyEmail: Yup.string()
    .nullable()
    .notRequired()
    .email(),
  companyName: Yup.string().when("hasCompany", {
    is: true,
    then: Yup.string().required("Required")
  }),
  companyEmail: Yup.string().when("hasCompany", {
    is: true,
    then: Yup.string()
      .email()
      .required("Required")
  })
});

const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Temporary"
];

function New({ primaryTags, user }) {
  const classes = useStyles();
  const [files, setFiles] = React.useState([]);
  const [showErrorSubmitting, setShowErrorSubmitting] = React.useState(false);
  React.useEffect(() => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  const handleSubmit = async function(values, actions) {
    let companyLogo = null;
    try {
      if (values.hasCompany && files.length > 0) {
        companyLogo = await api.uploadImage(files[0]);
      }
      const tags = cleanTags(values.tags);
      const primaryTagId =
        values.primaryTagId !== "" ? values.primaryTagId : null;
      const jobData = await api.createJob({
        ...values,
        tags,
        primaryTagId,
        companyLogo
      });
      Cookies.set(jobData.job.slug, jobData.job.adminToken);
      Router.push(`/jobs/${jobData.job.slug}`);
    } catch (err) {
      console.error(err);
      setShowErrorSubmitting(true);
    }
    actions.setSubmitting(false);
  };
  const router = useRouter();
  const pageUrl = `${process.env.ROOT_URL}${router.asPath}`;

  return (
    <Layout user={user}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:description" content={pageDescription} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta property="twitter:url" content={pageUrl} />
      </Head>
      <Container className={classes.root} maxWidth="md">
        <Formik
          validationSchema={validationSchema}
          initialValues={{
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
            return (
              <form className={classes.form} onSubmit={handleSubmit}>
                <HSCard title="Job Details">
                  <JobFormFields
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    primaryTags={primaryTags}
                  />
                </HSCard>
                {values.hasCompany && (
                  <HSCard
                    className={classes.companyDetails}
                    title="Company Details">
                    <TextField
                      label="Company Name*"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      name="companyName"
                      value={values.companyName}
                      onChange={handleChange}
                      error={!!(touched.companyName && errors.companyName)}
                      helperText={touched.companyName && errors.companyName}
                    />
                    <TextField
                      label="Company Email*"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      type="email"
                      name="companyEmail"
                      value={values.companyEmail}
                      onChange={handleChange}
                      error={!!(touched.companyEmail && errors.companyEmail)}
                      helperText={touched.companyEmail && errors.companyEmail}
                    />
                    <ImageDropdown files={files} onFilesChange={setFiles} />
                    <Box />
                  </HSCard>
                )}
                <Fab
                  type="submit"
                  variant="extended"
                  color="primary"
                  className={classes.postButton}
                  disabled={isSubmitting}>
                  <SaveIcon className={classes.saveButtonIcon} />
                  Post your job
                </Fab>
                <JobItem
                  className={classes.jobPreview}
                  company={
                    values.hasCompany
                      ? {
                          logo: files[0] && files[0].preview,
                          name: values.companyName
                        }
                      : null
                  }
                  job={{
                    position: values.position || "Position",
                    jobType: values.jobType
                  }}
                  tags={[
                    ...primaryTags
                      .filter(tag => tag.id === values.primaryTagId)
                      .map(tag => tag.name),
                    ...cleanTags(values.tags)
                  ]}
                  preview
                />
                {isSubmitting && <PageProgress />}
                <HSSnackbar
                  variant="error"
                  open={showErrorSubmitting}
                  onClose={() => setShowErrorSubmitting(false)}
                  message="Couldn't submit data. Please try again later."
                  autoHideDuration={6000}
                />
              </form>
            );
          }}
        </Formik>
      </Container>
    </Layout>
  );
}

New.getInitialProps = async ctx => {
  const { user } = ctx;

  if (user) {
    redirect(ctx, "/dashboard/jobs/new");
    return {};
  }

  const primaryTags = await api.getPrimaryTags(ctx);
  return { primaryTags };
};

export default New;
