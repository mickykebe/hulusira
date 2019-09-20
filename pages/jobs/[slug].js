import { useEffect, useState, useReducer } from "react";
import Router from "next/router";
import api from "../../api";
import Layout from "../../components/layout";
import JobContent from "../../components/job-content";
import { getJobAdminToken } from "../../utils/localStorage";
import {
  Toolbar,
  Button,
  Box,
  Container,
  Typography,
  Paper
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/styles";
import InfoIcon from "@material-ui/icons/Info";
import HSSnackbar from "../../components/hs-snackbar";

const useStyles = makeStyles(theme => ({
  toolbar: {
    padding: 0
  },
  banner: {
    backgroundColor: theme.palette.secondary.main,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: "white",
    marginTop: theme.spacing(2)
  },
  bannerText: {
    display: "flex",
    alignItems: "center"
  },
  infoIcon: {
    marginRight: theme.spacing(1)
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

function Job({ jobData }) {
  const [{ isClosingJob, errorClosingJob }, dispatch] = useReducer(
    jobCloseReducer,
    { isClosingJob: false, errorClosingJob: false }
  );
  const classes = useStyles();
  const [adminToken, setAdminToken] = useState(null);
  useEffect(() => {
    const verifyToken = async (id, adminToken) => {
      try {
        await api.verifyJobToken(id, adminToken);
        setAdminToken(adminToken);
      } catch (err) {
        setAdminToken(null);
      }
    };
    const { job } = jobData;
    const adminToken = getJobAdminToken(job.id);
    if (adminToken) {
      verifyToken(job.id, adminToken);
    }
  }, [jobData, setAdminToken]);
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
  return (
    <Layout>
      <Container>
        {jobData.job.approved === false && (
          <Paper className={classes.banner}>
            <Typography
              className={classes.bannerText}
              variant="subtitle1"
              color="inherit">
              <InfoIcon className={classes.infoIcon} /> This job is pending. It
              will be live once it gets admin approval.
            </Typography>
          </Paper>
        )}
        {!!adminToken && !jobData.job.closed && (
          <Toolbar className={classes.toolbar}>
            <Box flex={1} />
            <Button
              variant="contained"
              color="secondary"
              size="small"
              disabled={isClosingJob}
              onClick={handleCloseJob}>
              <CloseIcon className={classes.closeIcon} /> Close Job
            </Button>
          </Toolbar>
        )}
      </Container>
      <JobContent jobData={jobData} />
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

Job.getInitialProps = async ({ query }) => {
  const { slug } = query;
  const [primaryTags, jobData] = await Promise.all([
    api.getPrimaryTags(),
    api.getJob(slug)
  ]);
  return { jobData, primaryTags };
};

export default Job;
