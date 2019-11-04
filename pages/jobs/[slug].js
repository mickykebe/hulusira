import ***REMOVED*** useEffect, useState, useReducer ***REMOVED*** from "react";
import Head from "next/head";
import Router, ***REMOVED*** useRouter ***REMOVED*** from "next/router";
import nextCookie from "next-cookies";
import api from "../../api";
import Layout from "../../components/layout";
import JobContent from "../../components/job-content";
import ***REMOVED***
  Toolbar,
  Button,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
***REMOVED*** from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";
import Banner from "../../components/banner";

import HSSnackbar from "../../components/hs-snackbar";

const useStyles = makeStyles(theme => (***REMOVED***
  toolbar: ***REMOVED***
    padding: 0
  ***REMOVED***,
  closeIcon: ***REMOVED***
    fontSize: "1.125rem",
    marginRight: theme.spacing(0.5)
  ***REMOVED***
***REMOVED***));

function jobCloseReducer(state, action) ***REMOVED***
  switch (action.type) ***REMOVED***
    case "CLOSING_JOB":
      return ***REMOVED*** ...state, isClosingJob: true, errorClosingJob: false ***REMOVED***;
    case "CLOSED_JOB":
      return ***REMOVED*** ...state, isClosingJob: false, errorClosingJob: false ***REMOVED***;
    case "ERROR_CLOSING_JOB":
      return ***REMOVED*** ...state, isClosingJob: false, errorClosingJob: true ***REMOVED***;
    case "CLEAR_ERROR":
      return ***REMOVED*** ...state, errorClosingJob: false ***REMOVED***;
    default:
      throw new Error("Unidentified action type");
  ***REMOVED***
***REMOVED***

function Job(***REMOVED*** user, jobData, adminToken ***REMOVED***) ***REMOVED***
  const [***REMOVED*** isClosingJob, errorClosingJob ***REMOVED***, dispatch] = useReducer(
    jobCloseReducer,
    ***REMOVED*** isClosingJob: false, errorClosingJob: false ***REMOVED***
  );
  const classes = useStyles();
  const [isValidToken, setIsValidToken] = useState(false);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  useEffect(() => ***REMOVED***
    const verifyToken = async (id, adminToken) => ***REMOVED***
      try ***REMOVED***
        await api.verifyJobToken(id, adminToken);
        setIsValidToken(true);
      ***REMOVED*** catch (err) ***REMOVED***
        setIsValidToken(true);
      ***REMOVED***
    ***REMOVED***;
    const ***REMOVED*** job ***REMOVED*** = jobData;
    if (adminToken) ***REMOVED***
      verifyToken(job.id, adminToken);
    ***REMOVED***
  ***REMOVED***, [jobData, setIsValidToken]);
  const handleCloseJob = async () => ***REMOVED***
    dispatch(***REMOVED*** type: "CLOSING_JOB" ***REMOVED***);
    try ***REMOVED***
      await api.closeJob(jobData.job.id, adminToken);
      Router.push("/");
      dispatch(***REMOVED*** type: "CLOSED_JOB" ***REMOVED***);
    ***REMOVED*** catch (err) ***REMOVED***
      dispatch(***REMOVED*** type: "ERROR_CLOSING_JOB" ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;
  const metaTitle = `$***REMOVED***jobData.job.position***REMOVED***$***REMOVED***
    jobData.company ? ` at $***REMOVED***jobData.company.name***REMOVED***` : ""
  ***REMOVED***`;
  const metaDescription = `$***REMOVED***
    jobData.company ? `$***REMOVED***jobData.company.name***REMOVED*** is h` : "H"
  ***REMOVED***iring $***REMOVED***jobData.job.position***REMOVED***. $***REMOVED***jobData.job.description.slice(0, 250)***REMOVED***...`;
  const router = useRouter();
  const url = `$***REMOVED***process.env.ROOT_URL***REMOVED***$***REMOVED***router.asPath***REMOVED***`;
  const defaultThumbnailUrl = `$***REMOVED***process.env.ROOT_URL***REMOVED***/static/hulusira.png`;
  return (
    <Layout user=***REMOVED***user***REMOVED***>
      <Head>
        <title>***REMOVED***metaTitle***REMOVED***</title>
        <meta name="description" content=***REMOVED***metaDescription***REMOVED*** />
        <meta property="og:title" content=***REMOVED***metaTitle***REMOVED*** />
        <meta property="og:url" content=***REMOVED***url***REMOVED*** />
        <meta property="og:description" content=***REMOVED***metaDescription***REMOVED*** />
        <meta
          property="og:image"
          content=***REMOVED***
            (jobData.company && jobData.company.logo) || defaultThumbnailUrl
          ***REMOVED***
        />
        <meta name="twitter:title" content=***REMOVED***metaTitle***REMOVED*** />
        <meta name="twitter:description" content=***REMOVED***metaDescription***REMOVED*** />
        <meta
          property="twitter:image:src"
          content=***REMOVED***
            (jobData.company && jobData.company.logo) || defaultThumbnailUrl
          ***REMOVED***
        />
        <meta property="twitter:url" content=***REMOVED***url***REMOVED*** />
      </Head>
      <Container>
        ***REMOVED***jobData.job.closed && (
          <Banner message="This job is closed and thus no longer publicly accessible." />
        )***REMOVED***
        ***REMOVED***!jobData.job.closed && jobData.job.approvalStatus === "Pending" && (
          <Banner message="This job is pending. It will be live once it gets admin approval." />
        )***REMOVED***
        ***REMOVED***!jobData.job.closed && jobData.job.approvalStatus === "Declined" && (
          <Banner
            variant="error"
            message="Administrator has declined to approve this post."
          />
        )***REMOVED***
        ***REMOVED***!!isValidToken && !jobData.job.closed && (
          <Toolbar className=***REMOVED***classes.toolbar***REMOVED***>
            <Box flex=***REMOVED***1***REMOVED*** />
            <Button
              variant="contained"
              color="secondary"
              size="small"
              disabled=***REMOVED***isClosingJob***REMOVED***
              onClick=***REMOVED***() => setJobDialogOpen(true)***REMOVED***>
              <CloseIcon className=***REMOVED***classes.closeIcon***REMOVED*** /> Close Job
            </Button>
          </Toolbar>
        )***REMOVED***
      </Container>
      <JobContent jobData=***REMOVED***jobData***REMOVED*** />
      <Dialog open=***REMOVED***jobDialogOpen***REMOVED*** onClose=***REMOVED***() => setJobDialogOpen(false)***REMOVED***>
        <DialogTitle>Close this job?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Closing a job renders it publicly inaccessible from the site.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick=***REMOVED***() => setJobDialogOpen(false)***REMOVED*** color="primary">
            Cancel
          </Button>
          <Button onClick=***REMOVED***handleCloseJob***REMOVED*** color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <HSSnackbar
        open=***REMOVED***errorClosingJob***REMOVED***
        variant="error"
        message="Problem occurred closing job."
        autoHideDuration=***REMOVED***3000***REMOVED***
        onClose=***REMOVED***() => dispatch("CLEAR_ERROR")***REMOVED***
      />
    </Layout>
  );
***REMOVED***

Job.getInitialProps = async ctx => ***REMOVED***
  const ***REMOVED*** slug ***REMOVED*** = ctx.query;
  const cookies = nextCookie(ctx);
  const adminToken = cookies[slug];
  const [primaryTags, jobData] = await Promise.all([
    api.getPrimaryTags(ctx),
    api.getJob(ctx, slug, adminToken)
  ]);
  return ***REMOVED*** jobData, primaryTags, adminToken ***REMOVED***;
***REMOVED***;

export default Job;
