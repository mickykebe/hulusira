import React, { useState, useRef } from "react";
import Router, { useRouter } from "next/router";
import Head from "next/head";
import Cookies from "js-cookie";
import ReCAPTCHA from "react-google-recaptcha";
import * as Yup from "yup";
import { Box, Container, TextField, Fab, Collapse } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import SaveIcon from "@material-ui/icons/Save";
import { Formik } from "formik";
import api from "../api";
import Layout from "../components/layout";
import HSCard from "../components/hs-card";
import HSPaper from "../components/hs-paper";
import HSSnackbar from "../components/hs-snackbar";
import PageProgress from "../components/page-progress";
import ImageDropdown from "../components/image-dropdown";
import redirect from "../utils/redirect";
import JobSettingFormElement from "../components/job-setting-form-element";
import JobDetailsFormElement from "../components/job-details-form-element";
import { jobValidationSchema } from "../utils/validation";
import { cleanTags } from "../utils";
import JobPreviewFormElement from "../components/job-preview-form-element";
import Banner from "../components/banner";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(1)
  },
  banner: {
    marginBottom: theme.spacing(3)
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  headline: {
    fontWeight: 800
  },
  jobSetting: {
    marginBottom: theme.spacing(3)
  },
  companyDetails: {
    marginBottom: theme.spacing(3)
  },
  jobDetailsFormElement: {
    marginBottom: theme.spacing(3)
  },
  recaptchaBox: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(3)
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

const validationSchema = jobValidationSchema.concat(
  Yup.object().shape({
    recaptchaPassed: Yup.boolean().oneOf([true])
  })
);

function New({ primaryTags, user }) {
  const classes = useStyles();
  const [files, setFiles] = React.useState([]);
  const [successfullySubmitted, setSuccessfullySubmitted] = useState(false);
  const [showErrorSubmitting, setShowErrorSubmitting] = useState(false);
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
      const primaryTag = values.primaryTag !== "" ? values.primaryTag : null;
      const jobData = await api.createJob({
        ...values,
        tags,
        primaryTag,
        companyLogo
      });
      Cookies.set(jobData.job.slug, jobData.job.adminToken);
      setSuccessfullySubmitted(true);
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
        <Banner
          className={classes.banner}
          message="You can post a job without signing up. But creating a job after signing in gives you better job management capabilities. Consider signing in before posting a job."
          variant="warning"
        />
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            position: "",
            jobType: "",
            companyName: "",
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
            companyEmail: "",
            deadline: null,
            recaptchaPassed: false
          }}
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
            return (
              <form className={classes.form} onSubmit={handleSubmit}>
                <JobSettingFormElement
                  className={classes.jobSetting}
                  values={values}
                  setFieldValue={setFieldValue}
                />
                <Collapse in={values.hasCompany} unmountOnExit>
                  <HSCard
                    className={classes.companyDetails}
                    title="Company Details"
                  >
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
                </Collapse>
                <JobDetailsFormElement
                  className={classes.jobDetailsFormElement}
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                  primaryTags={primaryTags}
                />
                <HSPaper className={classes.recaptchaBox}>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.RECAPTCHA_KEY}
                    onChange={value =>
                      setFieldValue("recaptchaPassed", value !== null)
                    }
                  />
                </HSPaper>
                <Fab
                  type="submit"
                  variant="extended"
                  color="primary"
                  className={classes.postButton}
                  disabled={isSubmitting || successfullySubmitted}
                >
                  <SaveIcon className={classes.saveButtonIcon} />
                  Post your job
                </Fab>
                <JobPreviewFormElement
                  className={classes.jobPreview}
                  values={values}
                  company={
                    values.hasCompany
                      ? {
                          logo: files[0] && files[0].preview,
                          name: values.companyName
                        }
                      : null
                  }
                  companyLogo={files[0] && files[0].preview}
                  primaryTags={primaryTags}
                />
                {isSubmitting && <PageProgress />}
                <HSSnackbar
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
