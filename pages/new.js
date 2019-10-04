import React from "react";
import Router, { useRouter } from "next/router";
import Head from "next/head";
import Cookies from "js-cookie";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Fab,
  LinearProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import SaveIcon from "@material-ui/icons/Save";
import { useDropzone } from "react-dropzone";
import { Formik } from "formik";
import * as Yup from "yup";
import api from "../api";
import Layout from "../components/layout";
import HSCard from "../components/hs-card";
import JobItem from "../components/job-item";
import MDEditor from "../components/md-editor";
import HSSnackbar from "../components/hs-snackbar";

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
  employerType: {
    marginBottom: theme.spacing(1)
  },
  uploadContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  uploader: {
    border: `1px dashed ${theme.palette.grey[200]}`,
    display: "flex",
    padding: theme.spacing(4),
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  },
  uploaderThumbnail: {
    width: 130
  },
  previewThumb: {
    width: 150,
    height: 150,
    position: "relative",
    backgroundColor: "#fafbfc",
    margin: `${theme.spacing(2)}px 0`,
    border: `1px solid #eee`
  },
  previewThumbImg: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%"
  },
  jobPreview: {
    marginTop: theme.spacing(3)
  },
  postButton: {
    marginTop: theme.spacing(2)
  },
  hasCompany: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  saveButtonIcon: {
    marginRight: theme.spacing(1)
  },
  submittingProgress: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1350
  }
}));

const pageTitle = "Post job on HuluSira";
const pageDescription =
  "Access thousands of job applicants by posting on HuluSira";

const cleanTags = tags =>
  tags.map(tag => tag.trim()).filter(tag => tag.length > 0);

const validationSchema = Yup.object().shape(
  {
    position: Yup.string().required("Required"),
    jobType: Yup.string().required("Required"),
    primaryTagId: Yup.number().test(
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
    description: Yup.string().required("Required"),
    applyUrl: Yup.string().when("applyEmail", {
      is: value => !value,
      then: Yup.string().required("Provide application URL or email")
    }),
    applyEmail: Yup.string()
      .email()
      .when("applyUrl", {
        is: value => !value,
        then: Yup.string()
          .email()
          .required("Provide application email or URL")
      }),
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
  },
  ["applyUrl", "applyEmail"]
);

const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Temporary"
];

function New({ primaryTags }) {
  const classes = useStyles();
  const [files, setFiles] = React.useState([]);
  const [showErrorSubmitting, setShowErrorSubmitting] = React.useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: false,
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file => {
          file.preview = URL.createObjectURL(file);
          return file;
        })
      );
    }
  });
  React.useEffect(
    () => () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

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
    <Layout>
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
            monthlySalary: "",
            description: "",
            requirements: "",
            responsibilites: "",
            howToApply: "",
            applyUrl: "",
            applyEmail: "",
            companyEmail: ""
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
            const handleMdeChange = fieldName => value =>
              setFieldValue(fieldName, value);
            return (
              <form className={classes.form} onSubmit={handleSubmit}>
                <HSCard title="Job Details">
                  <TextField
                    name="position"
                    label="Position*"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={values.position}
                    onChange={handleChange}
                    error={!!(touched.position && errors.position)}
                    helperText={touched.position && errors.position}
                  />
                  <TextField
                    name="jobType"
                    select
                    value={values.jobType}
                    label="Job Type*"
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange}
                    error={!!(touched.jobType && errors.jobType)}
                    helperText={touched.jobType && errors.jobType}>
                    {jobTypes.map(jobType => (
                      <MenuItem key={jobType} value={jobType}>
                        {jobType}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    name="location"
                    label="Location"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={values.location}
                    onChange={handleChange}
                    error={!!(touched.location && errors.location)}
                    helperText={touched.location && errors.location}
                  />
                  <TextField
                    name="primaryTagId"
                    select
                    value={values.primaryTagId}
                    label="Primary Tag"
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange}
                    error={!!(touched.primaryTagId && errors.primaryTagId)}
                    helperText={
                      !!(touched.primaryTagId && errors.primaryTagId)
                        ? errors.primaryTagId
                        : "Choosing a tag here boosts your job's visibility."
                    }>
                    {primaryTags.map(tag => (
                      <MenuItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    name="tags"
                    label="Extra Tags"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    placeholder="Marketing, Software developer, Modeling, etc."
                    value={values.tags.join(",")}
                    onChange={ev => {
                      setFieldValue(
                        "tags",
                        ev.target.value.split(",").map(tag => tag.toUpperCase())
                      );
                    }}
                    error={!!(touched.tags && errors.tags)}
                    helperText={
                      !!(touched.tags && errors.tags)
                        ? errors.tags
                        : "List tags separated by comma(,)."
                    }
                  />
                  <TextField
                    name="monthlySalary"
                    label="Monthly Salary"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={values.monthlySalary}
                    onChange={handleChange}
                    error={!!(touched.monthlySalary && errors.monthlySalary)}
                    helperText={
                      !!(touched.monthlySalary && errors.monthlySalary)
                        ? errors.monthlySalary
                        : "Salary is not required but highly recommended. Enter salary data for better results."
                    }
                  />
                  <MDEditor
                    id="description"
                    label="Job Description*"
                    value={values.description}
                    onChange={handleMdeChange("description")}
                    error={!!(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                  <MDEditor
                    id="requirements"
                    label="Job Requirements"
                    value={values.requirements}
                    onChange={handleMdeChange("requirements")}
                  />
                  <MDEditor
                    id="responsibilities"
                    label="Job Responsibilities"
                    value={values.responsibilites}
                    onChange={handleMdeChange("responsibilities")}
                  />
                  <MDEditor
                    id="how_to_apply"
                    label="How to Apply"
                    value={values.howToApply}
                    onChange={handleMdeChange("howToApply")}
                  />
                  <Box display="flex" flexWrap="wrap">
                    <Box flex="1" flexBasis={["100%", "0"]}>
                      <TextField
                        name="applyUrl"
                        label="Apply URL*"
                        variant="outlined"
                        margin="normal"
                        helperText="The url can be a link to your telegram account, facebook URL or to a site where the job is posted."
                        fullWidth
                        value={values.applyUrl}
                        onChange={ev => {
                          setFieldValue("applyEmail", "");
                          handleChange(ev);
                        }}
                        error={!!(touched.applyUrl && errors.applyUrl)}
                        helperText={touched.applyUrl && errors.applyUrl}
                      />
                    </Box>
                    <Box
                      textAlign="center"
                      px={2}
                      my="auto"
                      flexBasis={["100%", "0"]}>
                      <Typography variant="subtitle2">OR</Typography>
                    </Box>
                    <Box flex="1" flexBasis={["100%", "0"]}>
                      <TextField
                        name="applyEmail"
                        label="Apply Email*"
                        variant="outlined"
                        margin="normal"
                        helperText="Your email address"
                        fullWidth
                        type="email"
                        value={values.applyEmail}
                        onChange={ev => {
                          setFieldValue("applyUrl", "");
                          handleChange(ev);
                        }}
                        error={!!(touched.applyEmail && errors.applyEmail)}
                        helperText={touched.applyEmail && errors.applyEmail}
                      />
                    </Box>
                  </Box>
                  <FormControlLabel
                    className={classes.hasCompany}
                    control={
                      <Switch
                        onChange={ev =>
                          setFieldValue("hasCompany", ev.target.checked)
                        }
                        checked={values.hasCompany}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="subtitle2">
                        This is a company job
                      </Typography>
                    }
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
                    <div className={classes.uploadContainer}>
                      <div {...getRootProps({ className: classes.uploader })}>
                        <input {...getInputProps()} />
                        <div>
                          <img
                            className={classes.uploaderThumbnail}
                            src="/static/photo.png"
                            alt="Uploader thumbnail"
                          />
                        </div>
                        <div>
                          <Typography align="center" variant="h6">
                            Company Logo
                          </Typography>
                          <Typography align="center" variant="body1">
                            Drag 'n' drop or click to upload company logo
                          </Typography>
                        </div>
                      </div>
                      {files.map(file => (
                        <Box className={classes.previewThumb} key={file.name}>
                          <img
                            className={classes.previewThumbImg}
                            src={file.preview}
                            alt="Company logo preview"
                          />
                        </Box>
                      ))}
                    </div>
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
                {isSubmitting && (
                  <LinearProgress
                    classes={{ root: classes.submittingProgress }}
                    color="primary"
                  />
                )}
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
  const primaryTags = await api.getPrimaryTags(ctx);
  return { primaryTags };
};

export default New;
