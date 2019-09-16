import React from "react";
import Router from "next/router";
import ***REMOVED***
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Fab,
  LinearProgress
***REMOVED*** from "@material-ui/core";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";
import SaveIcon from "@material-ui/icons/Save";
import ***REMOVED*** useDropzone ***REMOVED*** from "react-dropzone";
import ***REMOVED*** Formik ***REMOVED*** from "formik";
import * as Yup from "yup";
import api from "../api";
import Layout from "../components/layout";
import HSCard from "../components/hs-card";
import JobItem from "../components/job-item";
import MDEditor from "../components/md-editor";
import HSSnackbar from "../components/hs-snackbar";

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
  employerType: ***REMOVED***
    marginBottom: theme.spacing(1)
  ***REMOVED***,
  uploadContainer: ***REMOVED***
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  ***REMOVED***,
  uploader: ***REMOVED***
    border: `1px dashed $***REMOVED***theme.palette.grey[200]***REMOVED***`,
    display: "flex",
    padding: theme.spacing(4),
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  ***REMOVED***,
  uploaderThumbnail: ***REMOVED***
    width: 130
  ***REMOVED***,
  previewThumb: ***REMOVED***
    width: 150,
    height: 150,
    position: "relative",
    backgroundColor: "#fafbfc",
    margin: `$***REMOVED***theme.spacing(2)***REMOVED***px 0`,
    border: `1px solid #eee`
  ***REMOVED***,
  previewThumbImg: ***REMOVED***
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%"
  ***REMOVED***,
  jobPreview: ***REMOVED***
    marginTop: theme.spacing(3)
  ***REMOVED***,
  postButton: ***REMOVED***
    marginTop: theme.spacing(2)
  ***REMOVED***,
  hasCompany: ***REMOVED***
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  ***REMOVED***,
  saveButtonIcon: ***REMOVED***
    marginRight: theme.spacing(1)
  ***REMOVED***,
  submittingProgress: ***REMOVED***
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1350
  ***REMOVED***
***REMOVED***));

const cleanTags = tags =>
  tags.map(tag => tag.trim()).filter(tag => tag.length > 0);

const validationSchema = Yup.object().shape(
  ***REMOVED***
    position: Yup.string().required("Required"),
    jobType: Yup.string().required("Required"),
    primaryTagId: Yup.number().test(
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
    description: Yup.string().required("Required"),
    applyUrl: Yup.string().when("applyEmail", ***REMOVED***
      is: value => !value,
      then: Yup.string().required("Provide application URL or email")
    ***REMOVED***),
    applyEmail: Yup.string()
      .email()
      .when("applyUrl", ***REMOVED***
        is: value => !value,
        then: Yup.string()
          .email()
          .required("Provide application email or URL")
      ***REMOVED***),
    companyName: Yup.string().when("hasCompany", ***REMOVED***
      is: true,
      then: Yup.string().required("Required")
    ***REMOVED***),
    companyEmail: Yup.string()
      .email()
      .when("hasCompany", ***REMOVED***
        is: true,
        then: Yup.string()
          .email()
          .required("Required")
      ***REMOVED***)
  ***REMOVED***,
  ["applyUrl", "applyEmail"]
);

const jobTypes = [
  "Full-time",
  "Part-time",
  "Freelance",
  "Internship",
  "Temporary"
];

function New(***REMOVED*** primaryTags ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  const [files, setFiles] = React.useState([]);
  const [showErrorSubmitting, setShowErrorSubmitting] = React.useState(false);
  const ***REMOVED*** getRootProps, getInputProps ***REMOVED*** = useDropzone(***REMOVED***
    accept: "image/*",
    multiple: false,
    onDrop: acceptedFiles => ***REMOVED***
      setFiles(
        acceptedFiles.map(file => ***REMOVED***
          file.preview = URL.createObjectURL(file);
          return file;
        ***REMOVED***)
      );
    ***REMOVED***
  ***REMOVED***);
  React.useEffect(
    () => () => ***REMOVED***
      files.forEach(file => URL.revokeObjectURL(file.preview));
    ***REMOVED***,
    [files]
  );

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
      Router.push(`/jobs/$***REMOVED***jobData.job.id***REMOVED***`);
    ***REMOVED*** catch (err) ***REMOVED***
      console.error(err);
      setShowErrorSubmitting(true);
    ***REMOVED***
    actions.setSubmitting(false);
  ***REMOVED***;

  return (
    <Layout>
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
            monthlySalary: "",
            description: "",
            requirements: "",
            responsibilites: "",
            howToApply: "",
            applyUrl: "",
            applyEmail: "",
            companyEmail: ""
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
            const handleMdeChange = fieldName => value =>
              setFieldValue(fieldName, value);
            return (
              <form className=***REMOVED***classes.form***REMOVED*** onSubmit=***REMOVED***handleSubmit***REMOVED***>
                <HSCard title="Job Details">
                  <TextField
                    name="position"
                    label="Position*"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value=***REMOVED***values.position***REMOVED***
                    onChange=***REMOVED***handleChange***REMOVED***
                    error=***REMOVED***!!(touched.position && errors.position)***REMOVED***
                    helperText=***REMOVED***touched.position && errors.position***REMOVED***
                  />
                  <TextField
                    name="jobType"
                    select
                    value=***REMOVED***values.jobType***REMOVED***
                    label="Job Type*"
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    onChange=***REMOVED***handleChange***REMOVED***
                    error=***REMOVED***!!(touched.jobType && errors.jobType)***REMOVED***
                    helperText=***REMOVED***touched.jobType && errors.jobType***REMOVED***>
                    ***REMOVED***jobTypes.map(jobType => (
                      <MenuItem key=***REMOVED***jobType***REMOVED*** value=***REMOVED***jobType***REMOVED***>
                        ***REMOVED***jobType***REMOVED***
                      </MenuItem>
                    ))***REMOVED***
                  </TextField>
                  <TextField
                    name="location"
                    label="Location"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value=***REMOVED***values.location***REMOVED***
                    onChange=***REMOVED***handleChange***REMOVED***
                    error=***REMOVED***!!(touched.location && errors.location)***REMOVED***
                    helperText=***REMOVED***touched.location && errors.location***REMOVED***
                  />
                  <TextField
                    name="primaryTagId"
                    select
                    value=***REMOVED***values.primaryTagId***REMOVED***
                    label="Primary Tag"
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    onChange=***REMOVED***handleChange***REMOVED***
                    error=***REMOVED***!!(touched.primaryTagId && errors.primaryTagId)***REMOVED***
                    helperText=***REMOVED***
                      !!(touched.primaryTagId && errors.primaryTagId)
                        ? errors.primaryTagId
                        : "Choosing a tag here boosts your job's visibility."
                    ***REMOVED***>
                    ***REMOVED***primaryTags.map(tag => (
                      <MenuItem key=***REMOVED***tag.id***REMOVED*** value=***REMOVED***tag.id***REMOVED***>
                        ***REMOVED***tag.name***REMOVED***
                      </MenuItem>
                    ))***REMOVED***
                  </TextField>
                  <TextField
                    name="tags"
                    label="Extra Tags"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    placeholder="Marketing, Software developer, Modeling, etc."
                    value=***REMOVED***values.tags.join(",")***REMOVED***
                    onChange=***REMOVED***ev => ***REMOVED***
                      setFieldValue(
                        "tags",
                        ev.target.value.split(",").map(tag => tag.toUpperCase())
                      );
                    ***REMOVED******REMOVED***
                    error=***REMOVED***!!(touched.tags && errors.tags)***REMOVED***
                    helperText=***REMOVED***
                      !!(touched.tags && errors.tags)
                        ? errors.tags
                        : "List tags separated by comma(,)."
                    ***REMOVED***
                  />
                  <TextField
                    name="monthlySalary"
                    label="Monthly Salary"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value=***REMOVED***values.monthlySalary***REMOVED***
                    onChange=***REMOVED***handleChange***REMOVED***
                    error=***REMOVED***!!(touched.monthlySalary && errors.monthlySalary)***REMOVED***
                    helperText=***REMOVED***
                      !!(touched.monthlySalary && errors.monthlySalary)
                        ? errors.monthlySalary
                        : "Salary is not required but highly recommended. Enter salary data for better results."
                    ***REMOVED***
                  />
                  <MDEditor
                    id="description"
                    label="Job Description*"
                    value=***REMOVED***values.description***REMOVED***
                    onChange=***REMOVED***handleMdeChange("description")***REMOVED***
                    error=***REMOVED***!!(touched.description && errors.description)***REMOVED***
                    helperText=***REMOVED***touched.description && errors.description***REMOVED***
                  />
                  <MDEditor
                    id="requirements"
                    label="Job Requirements"
                    value=***REMOVED***values.requirements***REMOVED***
                    onChange=***REMOVED***handleMdeChange("requirements")***REMOVED***
                  />
                  <MDEditor
                    id="responsibilities"
                    label="Job Responsibilities"
                    value=***REMOVED***values.responsibilites***REMOVED***
                    onChange=***REMOVED***handleMdeChange("responsibilities")***REMOVED***
                  />
                  <MDEditor
                    id="how_to_apply"
                    label="How to Apply"
                    value=***REMOVED***values.howToApply***REMOVED***
                    onChange=***REMOVED***handleMdeChange("howToApply")***REMOVED***
                  />
                  <Box display="flex" flexWrap="wrap">
                    <Box flex="1" flexBasis=***REMOVED***["100%", "0"]***REMOVED***>
                      <TextField
                        name="applyUrl"
                        label="Apply URL*"
                        variant="outlined"
                        margin="normal"
                        helperText="The url can be a link to your telegram account, facebook URL or to a site where the job is posted."
                        fullWidth
                        value=***REMOVED***values.applyUrl***REMOVED***
                        onChange=***REMOVED***ev => ***REMOVED***
                          setFieldValue("applyEmail", "");
                          handleChange(ev);
                        ***REMOVED******REMOVED***
                        error=***REMOVED***!!(touched.applyUrl && errors.applyUrl)***REMOVED***
                        helperText=***REMOVED***touched.applyUrl && errors.applyUrl***REMOVED***
                      />
                    </Box>
                    <Box
                      textAlign="center"
                      px=***REMOVED***2***REMOVED***
                      my="auto"
                      flexBasis=***REMOVED***["100%", "0"]***REMOVED***>
                      <Typography variant="subtitle2">OR</Typography>
                    </Box>
                    <Box flex="1" flexBasis=***REMOVED***["100%", "0"]***REMOVED***>
                      <TextField
                        name="applyEmail"
                        label="Apply Email*"
                        variant="outlined"
                        margin="normal"
                        helperText="Your email address"
                        fullWidth
                        type="email"
                        value=***REMOVED***values.applyEmail***REMOVED***
                        onChange=***REMOVED***ev => ***REMOVED***
                          setFieldValue("applyUrl", "");
                          handleChange(ev);
                        ***REMOVED******REMOVED***
                        error=***REMOVED***!!(touched.applyEmail && errors.applyEmail)***REMOVED***
                        helperText=***REMOVED***touched.applyEmail && errors.applyEmail***REMOVED***
                      />
                    </Box>
                  </Box>
                  <FormControlLabel
                    className=***REMOVED***classes.hasCompany***REMOVED***
                    control=***REMOVED***
                      <Switch
                        onChange=***REMOVED***ev =>
                          setFieldValue("hasCompany", ev.target.checked)
                        ***REMOVED***
                        checked=***REMOVED***values.hasCompany***REMOVED***
                        color="primary"
                      />
                    ***REMOVED***
                    label=***REMOVED***
                      <Typography variant="subtitle2">
                        This is a company job
                      </Typography>
                    ***REMOVED***
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
                    <div className=***REMOVED***classes.uploadContainer***REMOVED***>
                      <div ***REMOVED***...getRootProps(***REMOVED*** className: classes.uploader ***REMOVED***)***REMOVED***>
                        <input ***REMOVED***...getInputProps()***REMOVED*** />
                        <div>
                          <img
                            className=***REMOVED***classes.uploaderThumbnail***REMOVED***
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
                      ***REMOVED***files.map(file => (
                        <Box className=***REMOVED***classes.previewThumb***REMOVED*** key=***REMOVED***file.name***REMOVED***>
                          <img
                            className=***REMOVED***classes.previewThumbImg***REMOVED***
                            src=***REMOVED***file.preview***REMOVED***
                            alt="Company logo preview"
                          />
                        </Box>
                      ))***REMOVED***
                    </div>
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
                ***REMOVED***isSubmitting && (
                  <LinearProgress
                    classes=***REMOVED******REMOVED*** root: classes.submittingProgress ***REMOVED******REMOVED***
                    color="secondary"
                  />
                )***REMOVED***
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

New.getInitialProps = async () => ***REMOVED***
  const primaryTags = await api.getPrimaryTags();
  return ***REMOVED*** primaryTags ***REMOVED***;
***REMOVED***;

export default New;
