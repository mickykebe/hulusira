import Link from "next/link";
import {
  makeStyles,
  Button,
  Box,
  Container,
  CircularProgress,
  Typography,
  Fab
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import api from "../api";
import Layout from "../components/layout";
import JobItem from "../components/job-item";
import useInfiniteScroller from "../hooks/use-infinite-scroll";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(1)
  },
  jobItem: {
    marginBottom: theme.spacing(2)
  },
  jobsLoadingSpinner: {
    display: "block",
    margin: "0 auto"
  }
}));

const jobsReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, isLoading: true, isError: false };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        jobs: [...state.jobs, ...action.payload.jobs],
        nextCursor: action.payload.nextCursor
      };
    case "FETCH_FAILURE":
      return { ...state, isLoading: false, isError: true };
    default:
      throw new Error("Invalid action type for jobsReducer");
  }
};

function Index({ primaryTags, jobPage }) {
  const [{ jobs, nextCursor, isLoading, isError }, dispatch] = React.useReducer(
    jobsReducer,
    {
      jobs: jobPage.jobs,
      nextCursor: jobPage.nextCursor,
      isLoading: false,
      isError: false
    }
  );
  const classes = useStyles();
  const fetchMoreJobs = async () => {
    dispatch({ type: "FETCH_INIT" });
    try {
      const jobPage = await api.getJobs({ cursor: nextCursor });
      dispatch({ type: "FETCH_SUCCESS", payload: jobPage });
    } catch (err) {
      dispatch({ type: "FETCH_FAILURE" });
    }
  };
  useInfiniteScroller(isLoading, !!nextCursor, fetchMoreJobs, isError);

  return (
    <Layout
      toolbarChildren={
        <React.Fragment>
          <Box flex="1" />
          <Link href="/new" passHref>
            <Button variant="contained" color="primary" size="large">
              Post a Job
            </Button>
          </Link>
        </React.Fragment>
      }>
      <Container className={classes.root} maxWidth="md">
        <React.Fragment>
          {jobs.map(({ job, company }) => {
            const { tags, ...jobData } = job;
            let primaryTag = null;
            if (jobData.primaryTagId !== null) {
              primaryTag = primaryTags.find(
                tag => tag.id === jobData.primaryTagId
              );
            }
            return (
              <JobItem
                key={job.id}
                className={classes.jobItem}
                job={jobData}
                tags={primaryTag ? [primaryTag, ...tags] : tags}
                company={company}
              />
            );
          })}
        </React.Fragment>
        {isLoading && (
          <CircularProgress
            classes={{ root: classes.jobsLoadingSpinner }}
            color="secondary"
          />
        )}
        {isError && (
          <Box textAlign="center">
            <Typography color="textSecondary" variant="h6">
              Problem occurred fetching data.
            </Typography>
            <Fab
              onClick={fetchMoreJobs}
              variant="extended"
              color="primary"
              size="medium">
              <RefreshIcon />
              Try Again
            </Fab>
          </Box>
        )}
      </Container>
    </Layout>
  );
}

Index.getInitialProps = async ctx => {
  const [primaryTags, jobPage] = await Promise.all([
    api.getPrimaryTags(),
    api.getJobs({ ctx })
  ]);
  return { jobPage, primaryTags };
};

export default Index;
