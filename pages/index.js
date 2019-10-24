import Link from "next/link";
import Router, { useRouter } from "next/router";
import Head from "next/head";
import {
  makeStyles,
  Button,
  Box,
  Container,
  CircularProgress,
  Typography,
  Fab,
  TextField,
  MenuItem
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import api from "../api";
import Layout from "../components/layout";
import JobItem from "../components/job-item";
import useIsInview from "../hooks/use-is-inview";
import TagFilter from "../components/tag-filter";
import { tagIdsfromQueryParam } from "../utils";
import { useEffect, useRef, useState, useCallback } from "react";

const useStyles = makeStyles(theme => ({
  jobItem: {
    marginBottom: theme.spacing(2)
  },
  jobsLoadingSpinner: {
    display: "block",
    margin: "0 auto"
  },
  categorySelect: {
    marginBottom: theme.spacing(2),
    background: theme.palette.common.white
  },
  categoryItem: {
    fontSize: "0.8rem"
  },
  nothingFound: {
    paddingTop: theme.spacing(4)
  }
}));

const pageTitle = "Hulusira - Jobs in Ethiopia";
const pageUrl = `${process.env.ROOT_URL}/`;
const pageDescription =
  "HuluSira is a job board for jobs based in Ethiopia. We aim to make the job posting and dissemination process as simple as possible. Get workers hired.";

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

function Index({ user, jobPage, activeTags, primaryTags }) {
  const [{ jobs, nextCursor, isLoading, isError }, dispatch] = React.useReducer(
    jobsReducer,
    {
      jobs: jobPage.jobs,
      nextCursor: jobPage.nextCursor,
      isLoading: false,
      isError: false
    }
  );
  const ticker = useRef(0);
  useEffect(() => {
    if (ticker.current > 0) {
      dispatch({ type: "TAG_FILTER", payload: jobPage });
    }
    ticker.current++;
  }, [jobPage]);

  const classes = useStyles();
  const router = useRouter();

  const fetchMoreJobs = async () => {
    const tickerVal = ticker.current;
    if (isLoading || !nextCursor) {
      return;
    }
    dispatch({ type: "FETCH_INIT" });
    try {
      const jobPage = await api.getJobs({
        tags: router.query.tags || "",
        cursor: nextCursor
      });
      if (tickerVal === ticker.current) {
        dispatch({ type: "FETCH_SUCCESS", payload: jobPage });
      }
    } catch (err) {
      if (tickerVal === ticker.current) {
        dispatch({ type: "FETCH_FAILURE" });
      }
    }
  };

  const [isIntersecting, sentinelRef] = useIsInview(300);
  useEffect(() => {
    if (isIntersecting) {
      fetchMoreJobs();
    }
  }, [isIntersecting]);
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

  const metaImage = `${process.env.ROOT_URL}/static/hulusira.png`;
  return (
    <Layout
      user={user}
      toolbarChildren={
        user ? null : (
          <React.Fragment>
            <Link href="/new" passHref>
              <Button variant="contained" color="primary">
                Post a Job
              </Button>
            </Link>
          </React.Fragment>
        )
      }>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={metaImage} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image:src" content={metaImage} />
        <meta name="twitter:url" content={pageUrl} />
      </Head>
      <Container maxWidth="md">
        {(!activeTags || activeTags.length === 0) && (
          <TextField
            value=""
            select
            className={classes.categorySelect}
            label="Select"
            onChange={ev => {
              const tagId = ev.target.value;
              handleTagClick(tagId);
            }}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            label="Choose category"
            margin="dense"
            variant="outlined"
            fullWidth>
            {primaryTags.map(tag => (
              <MenuItem
                className={classes.categoryItem}
                key={tag.id}
                value={tag.id}>
                {tag.name}
              </MenuItem>
            ))}
          </TextField>
        )}
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
          <div ref={sentinelRef} style={{ height: "1px" }} />
          {ticker.current > 0 && jobs.length === 0 && (
            <Typography
              variant="h4"
              color="textSecondary"
              align="center"
              className={classes.nothingFound}>
              😬 <br /> Nothing Found
            </Typography>
          )}
        </React.Fragment>
        {isLoading && (
          <CircularProgress
            classes={{ root: classes.jobsLoadingSpinner }}
            color="primary"
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
  const [jobPage, primaryTags] = await Promise.all([
    api.getJobs({ ctx, tags }),
    api.getPrimaryTags(ctx)
  ]);
  let activeTags = [];
  if (!!tags) {
    activeTags = await api.getTags(tags, ctx);
  }
  return { jobPage, activeTags, primaryTags };
};

export default Index;
