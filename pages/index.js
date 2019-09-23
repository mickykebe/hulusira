import Link from "next/link";
import Router, { useRouter } from "next/router";
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
import TagFilter from "../components/tag-filter";
import { tagIdsfromQueryParam } from "../utils";
import { useEffect } from "react";

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
    case "TAG_FILTER": {
      return {
        ...state,
        isLoading: false,
        isError: false,
        jobs: action.payload.jobs,
        nextCursor: action.payload.nextCursor
      };
    }
    default:
      throw new Error("Invalid action type for jobsReducer");
  }
};

function Index({ primaryTags, jobPage, activeTags }) {
  const [{ jobs, nextCursor, isLoading, isError }, dispatch] = React.useReducer(
    jobsReducer,
    {
      jobs: [],
      nextCursor: null,
      isLoading: false,
      isError: false
    }
  );
  useEffect(() => {
    dispatch({ type: "TAG_FILTER", payload: jobPage });
  }, [jobPage]);
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
  const handleTagClick = tagId => {
    const tagIndex = activeTags.findIndex(tag => tag.id === tagId);
    if (tagIndex !== -1) {
      return;
    }
    const tagIds = activeTags.map(tag => tag.id);
    const tags = `${tagId}${tagIds.length > 0 ? `,${tagIds.join(",")}` : ""}`;
    Router.push(`/?tags=${tags}`);
  };

  const removeTagFromFilter = tagId => {
    const tagIds = activeTags
      .filter(tag => tag.id !== tagId)
      .map(tag => tag.id);
    Router.push(`/${tagIds.length ? `?tags=${tagIds.join(",")}` : ""}`);
  };

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
          {activeTags.length > 0 && (
            <TagFilter tags={activeTags} onTagRemove={removeTagFromFilter} />
          )}
          {jobs.map(({ job, company }) => {
            return (
              <JobItem
                key={job.id}
                className={classes.jobItem}
                job={job}
                tags={job.tags}
                company={company}
                onTagClick={handleTagClick}
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
  const { tags = "" } = ctx.query;
  const [primaryTags, jobPage] = await Promise.all([
    api.getPrimaryTags(),
    api.getJobs({ ctx, tags })
  ]);
  let activeTags = [];
  if (!!tags) {
    activeTags = await api.getTags(tags);
  }
  return { jobPage, primaryTags, activeTags };
};

export default Index;
