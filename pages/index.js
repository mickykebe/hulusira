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
import { useEffect, useRef, Fragment } from "react";
import HeaderAd from "../components/header-ad";
import FeedAd from "../components/feed-ad";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2)
  },
  headerAd: {
    marginBottom: theme.spacing(1)
  },
  jobItem: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  jobsLoadingSpinner: {
    display: "block",
    margin: "0 auto"
  },
  categorySelect: {
    marginTop: theme.spacing(2),
    background: theme.palette.common.white
  },
  categoryItem: {
    fontWeight: 800,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
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

function Index({ user, jobPage, activeTagNames, primaryTags }) {
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
  }, [fetchMoreJobs, isIntersecting]);
  const handleTagClick = tagName => {
    const tagIndex = activeTagNames.findIndex(
      activeTagName => activeTagName === tagName
    );
    if (tagIndex !== -1) {
      return;
    }
    const tags = `${tagName}${
      activeTagNames.length > 0 ? `,${activeTagNames.join(",")}` : ""
    }`;
    Router.push(`/?tags=${tags}`);
  };

  const removeTagFromFilter = tagName => {
    const tagNames = activeTagNames.filter(
      activeTagName => activeTagName !== tagName
    );
    Router.push(`/${tagNames.length ? `?tags=${tagNames.join(",")}` : ""}`);
  };

  const metaImage = `${process.env.ROOT_URL}/static/hulusira.png`;
  return (
    <Layout
      user={user}
      toolbarChildren={
        user ? null : (
          <Fragment>
            <Link href="/new" passHref>
              <Button variant="contained" color="primary">
                Post a Job
              </Button>
            </Link>
          </Fragment>
        )
      }
    >
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
      <Container className={classes.root} maxWidth="md">
        <HeaderAd className={classes.headerAd} />
        {(!activeTagNames || activeTagNames.length === 0) && (
          <TextField
            value=""
            select
            className={classes.categorySelect}
            label="Select"
            onChange={ev => {
              const tagName = ev.target.value;
              handleTagClick(tagName);
            }}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            label="Choose category"
            margin="dense"
            variant="outlined"
            fullWidth
          >
            {primaryTags.map(tag => (
              <MenuItem
                className={classes.categoryItem}
                key={tag.name}
                value={tag.name}
              >
                {tag.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        <Fragment>
          {activeTagNames.length > 0 && (
            <TagFilter
              tagNames={activeTagNames}
              onTagRemove={removeTagFromFilter}
            />
          )}
          {jobs.map(({ job, company }, index) => {
            return (
              <Fragment key={job.id}>
                {process.env.NODE_ENV === "production" &&
                  index % 4 === 0 &&
                  index > 0 && <FeedAd />}
                <JobItem
                  className={classes.jobItem}
                  job={job}
                  tags={job.tags}
                  company={company}
                  onTagClick={handleTagClick}
                />
              </Fragment>
            );
          })}
          <div ref={sentinelRef} style={{ height: "1px" }} />
          {ticker.current > 0 && jobs.length === 0 && (
            <Typography
              variant="h4"
              color="textSecondary"
              align="center"
              className={classes.nothingFound}
            >
              😬 <br /> Nothing Found
            </Typography>
          )}
        </Fragment>
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
              size="medium"
            >
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
  let activeTagNames = tags
    .split(",")
    .filter(name => !!name)
    .map(name => name.toUpperCase().trim());
  const [jobPage, primaryTags] = await Promise.all([
    api.getJobs({ ctx, tags: activeTagNames.join(",") }),
    api.getPrimaryTags(ctx)
  ]);

  return { jobPage, activeTagNames, primaryTags };
};

export default Index;
