import Link from "next/link";
import ***REMOVED***
  makeStyles,
  Button,
  Box,
  Container,
  CircularProgress,
  Typography,
  Fab
***REMOVED*** from "@material-ui/core";
import RefreshIcon from '@material-ui/icons/Refresh';
import api from "../api";
import Layout from "../components/layout";
import JobItem from "../components/job-item";
import useInfiniteScroller from "../hooks/use-infinite-scroll";

const useStyles = makeStyles(theme => (***REMOVED***
  jobItem: ***REMOVED***
    marginBottom: theme.spacing(2)
  ***REMOVED***,
  jobsLoadingSpinner: ***REMOVED***
    display: "block",
    margin: "0 auto"
  ***REMOVED***
***REMOVED***));

const jobsReducer = (state, action) => ***REMOVED***
  switch (action.type) ***REMOVED***
    case "FETCH_INIT":
      return ***REMOVED*** ...state, isLoading: true, isError: false ***REMOVED***;
    case "FETCH_SUCCESS":
      return ***REMOVED***
        ...state,
        isLoading: false,
        isError: false,
        jobs: [...state.jobs, ...action.payload.jobs],
        nextCursor: action.payload.nextCursor
      ***REMOVED***;
    case "FETCH_FAILURE":
      return ***REMOVED*** ...state, isLoading: false, isError: true ***REMOVED***;
    default:
      throw new Error("Invalid action type for jobsReducer");
  ***REMOVED***
***REMOVED***;

function Index(***REMOVED*** primaryTags, jobPage ***REMOVED***) ***REMOVED***
  const [***REMOVED*** jobs, nextCursor, isLoading, isError ***REMOVED***, dispatch] = React.useReducer(
    jobsReducer,
    ***REMOVED***
      jobs: jobPage.jobs,
      nextCursor: jobPage.nextCursor,
      isLoading: false,
      isError: false
    ***REMOVED***
  );
  const classes = useStyles();
  const fetchMoreJobs = async () => ***REMOVED***
    dispatch(***REMOVED*** type: "FETCH_INIT" ***REMOVED***);
    try ***REMOVED***
      const jobPage = await api.getJobs(nextCursor);
      dispatch(***REMOVED*** type: "FETCH_SUCCESS", payload: jobPage ***REMOVED***);
    ***REMOVED*** catch (err) ***REMOVED***
      dispatch(***REMOVED*** type: "FETCH_FAILURE" ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;
  useInfiniteScroller(isLoading, !!nextCursor, fetchMoreJobs, isError);

  return (
    <Layout
      toolbarChildren=***REMOVED***
        <React.Fragment>
          <Box flex="1" />
          <Link href="/new" passHref>
            <Button variant="contained" color="primary" size="large">
              Post a Job
            </Button>
          </Link>
        </React.Fragment>
      ***REMOVED***>
      <Container maxWidth="md">
        <React.Fragment>
          ***REMOVED***jobs.map((***REMOVED*** job, company ***REMOVED***) => ***REMOVED***
            const ***REMOVED*** tags, ...jobData ***REMOVED*** = job;
            let primaryTag = null;
            if (jobData.primaryTagId !== null) ***REMOVED***
              primaryTag = primaryTags.find(
                tag => tag.id === jobData.primaryTagId
              );
            ***REMOVED***
            return (
              <JobItem
                key=***REMOVED***job.id***REMOVED***
                className=***REMOVED***classes.jobItem***REMOVED***
                job=***REMOVED***jobData***REMOVED***
                tags=***REMOVED***primaryTag ? [primaryTag, ...tags] : tags***REMOVED***
                company=***REMOVED***company***REMOVED***
              />
            );
          ***REMOVED***)***REMOVED***
        </React.Fragment>
        ***REMOVED***isLoading && (
          <CircularProgress
            classes=***REMOVED******REMOVED*** root: classes.jobsLoadingSpinner ***REMOVED******REMOVED***
            color="secondary"
          />
        )***REMOVED***
        ***REMOVED***
          isError && (
            <Box textAlign="center">
              <Typography color="textSecondary" variant="h6">
                Problem occurred fetching data.
              </Typography>
              <Fab onClick=***REMOVED***fetchMoreJobs***REMOVED*** variant="extended" color="primary" size="medium">
                <RefreshIcon />
                Try Again
              </Fab>
            </Box>
          )
        ***REMOVED***
      </Container>
    </Layout>
  );
***REMOVED***

Index.getInitialProps = async () => ***REMOVED***
  const [primaryTags, jobPage] = await Promise.all([
    api.getPrimaryTags(),
    api.getJobs()
  ]);
  return ***REMOVED*** jobPage, primaryTags ***REMOVED***;
***REMOVED***;

export default Index;
