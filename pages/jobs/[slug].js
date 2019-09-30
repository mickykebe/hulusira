import { useEffect, useState, useReducer } from "react";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import nextCookie from "next-cookies";
import api from "../../api";
import Layout from "../../components/layout";
import JobContent from "../../components/job-content";
import {
  Toolbar,
  Button,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/styles";
import Banner from "../../components/banner";

import HSSnackbar from "../../components/hs-snackbar";

const useStyles = makeStyles(theme => ({
  toolbar: {
    padding: 0
  },
  closeIcon: {
    fontSize: 18,
    marginRight: theme.spacing(0.5)
  }
}));

function jobCloseReducer(state, action) {
  switch (action.type) {
    case "CLOSING_JOB":
      return { ...state, isClosingJob: true, errorClosingJob: false };
    case "CLOSED_JOB":
      return { ...state, isClosingJob: false, errorClosingJob: false };
    case "ERROR_CLOSING_JOB":
      return { ...state, isClosingJob: false, errorClosingJob: true };
    case "CLEAR_ERROR":
      return { ...state, errorClosingJob: false };
    default:
      throw new Error("Unidentified action type");
  }
}

function Job({ jobData, adminToken }) {
  const [{ isClosingJob, errorClosingJob }, dispatch] = useReducer(
    jobCloseReducer,
    { isClosingJob: false, errorClosingJob: false }
  );
  const classes = useStyles();
  const [isValidToken, setIsValidToken] = useState(false);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  useEffect(() => {
    const verifyToken = async (id, adminToken) => {
      try {
        await api.verifyJobToken(id, adminToken);
        setIsValidToken(true);
      } catch (err) {
        setIsValidToken(true);
      }
    };
    const { job } = jobData;
    if (adminToken) {
      verifyToken(job.id, adminToken);
    }
  }, [jobData, setIsValidToken]);
  const handleCloseJob = async () => {
    dispatch({ type: "CLOSING_JOB" });
    try {
      await api.closeJob(jobData.job.id, adminToken);
      Router.push("/");
      dispatch({ type: "CLOSED_JOB" });
    } catch (err) {
      dispatch({ type: "ERROR_CLOSING_JOB" });
    }
  };
  const metaTitle = `${jobData.job.position}${
    jobData.company ? ` at ${jobData.company.name}` : ""
  }`;
  const metaDescription = `${
    jobData.company ? `${jobData.company.name} is h` : "H"
  }iring ${jobData.job.position}. ${jobData.job.description.slice(0, 250)}...`;
  const router = useRouter();
  const url = `${process.env.ROOT_URL}${router.asPath}`;
  return (
    <Layout>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={metaDescription} />
        {jobData.company && jobData.company.logo && (
          <meta property="og:image" content={jobData.company.logo} />
        )}
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {jobData.company && jobData.company.logo && (
          <meta property="twitter:image:src" content={jobData.company.logo} />
        )}
        <meta property="twitter:url" content={url} />
      </Head>
      <Container>
        {jobData.job.closed && (
          <Banner message="This job is closed and thus no longer publicly accessible." />
        )}
        {!jobData.job.closed && !jobData.job.approved && (
          <Banner message="This job is pending. It will be live once it gets admin approval." />
        )}
        {!!isValidToken && !jobData.job.closed && (
          <Toolbar className={classes.toolbar}>
            <Box flex={1} />
            <Button
              variant="contained"
              color="secondary"
              size="small"
              disabled={isClosingJob}
              onClick={() => setJobDialogOpen(true)}>
              <CloseIcon className={classes.closeIcon} /> Close Job
            </Button>
          </Toolbar>
        )}
      </Container>
      <JobContent jobData={jobData} />
      <Dialog open={jobDialogOpen} onClose={() => setJobDialogOpen(false)}>
        <DialogTitle>Close this job?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Closing a job renders it publicly inaccessible from the site.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJobDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseJob} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <HSSnackbar
        open={errorClosingJob}
        variant="error"
        message="Problem occurred closing job."
        autoHideDuration={3000}
        onClose={() => dispatch("CLEAR_ERROR")}
      />
    </Layout>
  );
}

Job.getInitialProps = async ctx => {
  const { slug } = ctx.query;
  const cookies = nextCookie(ctx);
  const adminToken = cookies[slug];
  const [primaryTags, jobData] = await Promise.all([
    api.getPrimaryTags(ctx),
    api.getJob(slug, adminToken, ctx)
  ]);
  return { jobData, primaryTags, adminToken };
};

export default Job;
