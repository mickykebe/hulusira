import { Fragment, useReducer } from "react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  ListItemText,
  Toolbar,
  Button
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import nextCookie from "next-cookies";
import api from "../api";
import redirect from "../utils/redirect";
import Layout from "../components/layout";
import CompanyLogo from "../components/company-logo";
import JobContent from "../components/job-content";
import { makeStyles } from "@material-ui/styles";
import HSSnackbar from "../components/hs-snackbar";

const useStyles = makeStyles(theme => ({
  jobList: props => ({
    position: "fixed",
    top: 64,
    bottom: 0,
    display: props.activeJob ? "none" : "flex",
    flexDirection: "column",
    borderRight: `1px solid ${theme.palette.grey[200]}`,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      display: "flex",
      width: 300,
      flexShrink: 0
    }
  }),
  jobDisplay: props => {
    return {
      marginLeft: 300,
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.down("sm")]: {
        display: "flex",
        margin: 0
      }
    };
  },
  actionButton: {
    marginRight: theme.spacing(1)
  }
}));

const jobReducer = (state, action) => {
  switch (action.type) {
    case "UPDATING_JOB": {
      return { ...state, inProgress: true, error: false };
    }
    case "UPDATED_JOB": {
      return {
        ...state,
        inProgress: false,
        error: false
      };
    }
    case "ERROR_UPDATING_JOB": {
      return { ...state, inProgress: false, error: true };
    }
    case "CLEAR_ERROR": {
      return { ...state, error: false };
    }
    default:
      throw new Error("Unrecognized action type");
  }
};

function PendingJobs({ jobs, user }) {
  const [jobUpdateState, dispatch] = useReducer(jobReducer, {
    inProgress: false,
    error: false
  });
  let activeJobData;
  const router = useRouter();
  const { jobId } = router.query;
  const activeJobId = parseInt(jobId);
  if (!!activeJobId) {
    activeJobData = jobs.find(jobData => jobData.job.id === activeJobId);
  }
  const approveJob = async jobId => {
    dispatch({ type: "UPDATING_JOB" });
    try {
      await api.approveJob(jobId);
      dispatch({ type: "UPDATED_JOB" });
      Router.replace("/pending-jobs");
    } catch (err) {
      console.error(err);
      dispatch({ type: "ERROR_UPDATING_JOB" });
    }
  };
  const removeJob = async jobId => {
    dispatch({ type: "UPDATING_JOB" });
    try {
      await api.removeJob(jobId);
      dispatch({ type: "UPDATED_JOB" });
      Router.replace("/pending-jobs");
    } catch (err) {
      console.error(err);
      dispatch({ type: "ERROR_UPDATING_JOB" });
    }
  };
  const classes = useStyles({ activeJob: !!activeJobData });
  return (
    <Layout user={user}>
      <Box className={classes.jobList}>
        <List className={classes.list}>
          {jobs.map(({ job, company }, index) => (
            <Fragment key={job.id}>
              <Link
                href={`/pending-jobs?jobId=${job.id}`}
                as={`/pending-jobs/${job.id}`}>
                <ListItem button>
                  {!!company && (
                    <ListItemAvatar>
                      <CompanyLogo company={company} size="small" />
                    </ListItemAvatar>
                  )}
                  <ListItemText
                    primary={job.position}
                    primaryTypographyProps={{ variant: "subtitle2" }}
                    secondary={!!company ? company.name : job.jobType}
                  />
                </ListItem>
              </Link>
              {index + 1 !== jobs.length && <Divider light />}
            </Fragment>
          ))}
        </List>
      </Box>
      {!!activeJobData && (
        <Box className={classes.jobDisplay}>
          <Toolbar>
            <Box flexGrow={1} />
            <Button
              color="primary"
              variant="contained"
              className={classes.actionButton}
              disabled={jobUpdateState.inProgress}
              onClick={() => approveJob(activeJobId)}>
              <DoneIcon /> Approve
            </Button>
            <Button
              color="secondary"
              variant="contained"
              className={classes.actionButton}
              disabled={jobUpdateState.inProgress}
              onClick={() => removeJob(activeJobId)}>
              <ClearIcon /> Drop
            </Button>
          </Toolbar>
          <JobContent jobData={activeJobData} />
          <HSSnackbar
            variant="error"
            open={jobUpdateState.error}
            message="Problem occurred updating job"
            autoHideDuration={3000}
            onClose={() => dispatch({ type: "CLEAR_ERROR" })}
          />
        </Box>
      )}
    </Layout>
  );
}

PendingJobs.getInitialProps = async function(ctx) {
  const { user } = ctx;

  if (!user || user.role !== "admin") {
    redirect(ctx, "/");
    return {};
  }

  let jobs;
  try {
    jobs = await api.getPendingJobs(ctx);
  } catch (err) {
    console.log(err);
  }
  return { jobs };
};

export default PendingJobs;
