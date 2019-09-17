import { Fragment } from "react";
import { useRouter } from "next/router";
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

//add breakpoints
function PendingJobs({ jobs }) {
  let activeJobData;
  const router = useRouter();
  const { jobId } = router.query;
  const activeJobId = parseInt(jobId);
  if (!!activeJobId) {
    activeJobData = jobs.find(jobData => jobData.job.id === activeJobId);
  }
  console.log({ activeJobData });
  const classes = useStyles({ activeJob: !!activeJobData });
  return (
    <Layout>
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
              className={classes.actionButton}>
              <DoneIcon /> Approve
            </Button>
            <Button
              color="secondary"
              variant="contained"
              className={classes.actionButton}>
              <ClearIcon /> Drop
            </Button>
          </Toolbar>
          <JobContent jobData={activeJobData} />
        </Box>
      )}
    </Layout>
  );
}

PendingJobs.getInitialProps = async function(ctx) {
  if (ctx.req) {
    const { qid: sessionId } = nextCookie(ctx);
    if (!sessionId) {
      redirect(ctx, "/");
      return {};
    }
  }

  let user;

  try {
    user = await api.activeUser(ctx);
    if (user.role !== "admin") {
      throw new Error("Not permitted");
    }
  } catch (err) {
    redirect(ctx, "/");
    return {};
  }

  const jobs = await api.getPendingJobs(ctx);

  return { user, jobs };
};

export default PendingJobs;
