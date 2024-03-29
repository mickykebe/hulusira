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
  useMediaQuery,
  useTheme,
  Badge,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Hidden,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import RefreshIcon from "@material-ui/icons/Refresh";
import api from "../api";
import Layout from "../components/layout";
import JobItem from "../components/job-item";
import useIsInview from "../hooks/use-is-inview";
import TagFilter from "../components/tag-filter";
import {
  useEffect,
  useRef,
  Fragment,
  useCallback,
  useState,
  useReducer,
} from "react";
import HeaderAd from "../components/header-ad";
import FeedAd from "../components/feed-ad";
import JobFilterPanels from "../components/job-filter-panels";
import queryString from "query-string";
import HSPaper from "../components/hs-paper";
import GoogleAd from "../components/google-ad";

const useStyles = makeStyles((theme) => ({
  wrapperGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 3fr",
    gridGap: theme.spacing(1.5),
    alignItems: "start",
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr",
    },
  },
  headerAd: {
    marginBottom: theme.spacing(1.5),
  },
  filterExpansionPanel: {
    boxShadow: "none",
    backgroundColor: "inherit",
    "&::before": {
      display: "none",
    },
  },
  filterPanelSummary: {
    padding: "0 1rem",
  },
  filterPanelDetails: {
    padding: 0,
  },
  filterHead: ({ smallScreen }) => {
    return {
      ...(smallScreen && {
        borderBottom: `1px solid ${theme.palette.grey[400]}`,
        borderTop: `1px solid ${theme.palette.grey[400]}`,
      }),
      ...(!smallScreen && {
        paddingBottom: `0.5rem`,
      }),
    };
  },
  jobItem: {
    marginBottom: theme.spacing(1.5),
  },
  feedAd: {
    marginBottom: theme.spacing(1.5),
  },
  categorySelect: {
    marginTop: theme.spacing(2),
    background: theme.palette.common.white,
  },
  categoryItem: {
    fontWeight: 800,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    fontSize: "0.8rem",
  },
  nothingFound: {
    paddingTop: theme.spacing(4),
  },
}));

function getFilterQuery(queryPath) {
  const queryParams = queryString.parse(queryPath, {
    arrayFormat: "bracket",
  });
  return queryString.stringify(
    {
      tags: queryParams.tags,
      jobTypes: queryParams.jobTypes,
      careerLevels: queryParams.careerLevels,
    },
    { arrayFormat: "bracket" }
  );
}

const pageTitle = `${process.env.NEXT_PUBLIC_APP_NAME} - Jobs in Ethiopia`;
const pageUrl = `${process.env.NEXT_PUBLIC_ROOT_URL}/`;
const pageDescription = `${process.env.NEXT_PUBLIC_APP_NAME} is a job board for jobs based in Ethiopia. We aim to make the job posting and dissemination process as simple as possible. Get workers hired.`;

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
        nextCursor: action.payload.nextCursor,
      };
    case "FETCH_FAILURE":
      return { ...state, isLoading: false, isError: true };
    case "TAG_FILTER": {
      return {
        ...state,
        isLoading: false,
        isError: false,
        jobs: action.payload.jobs,
        nextCursor: action.payload.nextCursor,
      };
    }
    default:
      throw new Error("Invalid action type for jobsReducer");
  }
};

function Index({ user, jobPage, primaryTags }) {
  const [{ jobs, nextCursor, isLoading, isError }, dispatch] = useReducer(
    jobsReducer,
    {
      jobs: jobPage.jobs,
      nextCursor: jobPage.nextCursor,
      isLoading: false,
      isError: false,
    }
  );
  const ticker = useRef(0);
  useEffect(() => {
    if (ticker.current > 0) {
      dispatch({ type: "TAG_FILTER", payload: jobPage });
    }
    ticker.current++;
  }, [jobPage]);

  const router = useRouter();
  const parsedQS = queryString.parse(queryString.extract(router.asPath), {
    arrayFormat: "bracket",
  });
  const activeTagNames = parsedQS.tags || [];
  const hasActiveFilter =
    parsedQS.tags || parsedQS.jobTypes || parsedQS.careerLevels;
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [filterCollapsed, setFilterCollapsed] = useState(true);
  const classes = useStyles({ smallScreen });

  const fetchMoreJobs = useCallback(async () => {
    const tickerVal = ticker.current;
    if (isLoading || !nextCursor) {
      return;
    }
    dispatch({ type: "FETCH_INIT" });
    try {
      const filterQuery = getFilterQuery(location.search);
      const jobPage = await api.getJobs({
        filterQuery,
        cursor: nextCursor,
      });
      if (tickerVal === ticker.current) {
        dispatch({ type: "FETCH_SUCCESS", payload: jobPage });
      }
    } catch (err) {
      if (tickerVal === ticker.current) {
        dispatch({ type: "FETCH_FAILURE" });
      }
    }
  }, [isLoading, nextCursor]);

  const [isIntersecting, sentinelRef] = useIsInview(300);
  /* useEffect(() => {
    if (isIntersecting) {
      fetchMoreJobs();
    }
  }, [fetchMoreJobs, isIntersecting]); */
  const addFilter = (key, value) => {
    const parsed = queryString.parse(location.search, {
      arrayFormat: "bracket",
    });
    if (!parsed[key]) {
      parsed[key] = [value];
    } else {
      if (parsed[key].indexOf(value) !== -1) {
        return;
      }
      parsed[key].push(value);
    }
    Router.push(
      `/?${queryString.stringify(parsed, { arrayFormat: "bracket" })}`
    );
  };
  const addTagToFilter = (tagName) => {
    addFilter("tags", tagName);
  };

  const removeFilter = (key, value) => {
    const parsed = queryString.parse(location.search, {
      arrayFormat: "bracket",
    });
    if (parsed[key] && parsed[key].length > 0) {
      parsed[key] = parsed[key].filter((val) => {
        return val !== value;
      });
      Router.push(
        `/?${queryString.stringify(parsed, { arrayFormat: "bracket" })}`
      );
    }
  };
  const clearFilter = (key) => () => {
    const parsed = queryString.parse(location.search, {
      arrayFormat: "bracket",
    });
    if (parsed[key] && parsed[key].length > 0) {
      parsed[key] = [];
    }
    Router.push(
      `/?${queryString.stringify(parsed, { arrayFormat: "bracket" })}`
    );
  };
  const removeTagFromFilter = (tagName) => {
    removeFilter("tags", tagName);
  };

  const metaImage = `${process.env.NEXT_PUBLIC_ROOT_URL}/static/hulusira.png`;
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
      <Box maxWidth={1920} py={1.5} px={{ md: 1.5 }}>
        <Box className={classes.wrapperGrid}>
          <Hidden mdUp>
            <GoogleAd
              style={{ display: "inline-block", width: 320, height: 50 }}
              dataAdSlot={process.env.NEXT_PUBLIC_ADSENSE_MOBILE_HEADER_AD_SLOT}
            />
          </Hidden>
          <HSPaper>
            {smallScreen && (
              <ExpansionPanel
                classes={{
                  root: classes.filterExpansionPanel,
                }}
                expanded={!filterCollapsed}
                onChange={(_ev, isExpanded) => {
                  setFilterCollapsed(!isExpanded);
                }}>
                <ExpansionPanelSummary
                  classes={{
                    root: classes.filterPanelSummary,
                  }}
                  expandIcon={
                    hasActiveFilter ? (
                      <Badge color="primary" variant="dot">
                        <FilterListIcon />
                      </Badge>
                    ) : (
                      <FilterListIcon />
                    )
                  }>
                  <Typography variant="h6">Filter</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.filterPanelDetails}>
                  <JobFilterPanels
                    tags={primaryTags}
                    onCheckTagFilter={addTagToFilter}
                    onUncheckTagFilter={removeTagFromFilter}
                    onClearTagFilter={clearFilter("tags")}
                    onCheckJobTypeFilter={(jobType) => {
                      addFilter("jobTypes", jobType);
                    }}
                    onUncheckJobTypeFilter={(jobType) => {
                      removeFilter("jobTypes", jobType);
                    }}
                    onClearJobTypeFilter={clearFilter("jobTypes")}
                    onCheckCareerLevelFilter={(careerLevel) => {
                      addFilter("careerLevels", careerLevel);
                    }}
                    onUncheckCareerLevelFilter={(careerLevel) => {
                      removeFilter("careerLevels", careerLevel);
                    }}
                    onClearCareerLevelFilter={clearFilter("careerLevels")}
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )}
            {!smallScreen && (
              <Fragment>
                <Box display="flex" alignItems="center" p={2}>
                  <Typography variant="h6">Filter</Typography>
                </Box>
                <JobFilterPanels
                  tags={primaryTags}
                  onCheckTagFilter={addTagToFilter}
                  onUncheckTagFilter={removeTagFromFilter}
                  onClearTagFilter={clearFilter("tags")}
                  onCheckJobTypeFilter={(jobType) => {
                    addFilter("jobTypes", jobType);
                  }}
                  onUncheckJobTypeFilter={(jobType) => {
                    removeFilter("jobTypes", jobType);
                  }}
                  onClearJobTypeFilter={clearFilter("jobTypes")}
                  onCheckCareerLevelFilter={(careerLevel) => {
                    addFilter("careerLevels", careerLevel);
                  }}
                  onUncheckCareerLevelFilter={(careerLevel) => {
                    removeFilter("careerLevels", careerLevel);
                  }}
                  onClearCareerLevelFilter={clearFilter("careerLevels")}
                />
              </Fragment>
            )}
          </HSPaper>
          <Box>
            <Hidden smDown>
              <HeaderAd className={classes.headerAd} />
            </Hidden>
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
                    index > 0 && <FeedAd className={classes.feedAd} />}
                  <JobItem
                    className={classes.jobItem}
                    job={job}
                    tags={job.tags}
                    company={company}
                    onTagClick={addTagToFilter}
                  />
                </Fragment>
              );
            })}
            {!!nextCursor && (
              <Button
                size="large"
                color="primary"
                variant="text"
                fullWidth
                onClick={fetchMoreJobs}
                disabled={isLoading}>
                {isLoading && (
                  <Box display="flex" mr={1}>
                    <CircularProgress size={16} color="primary" />
                  </Box>
                )}
                Load More Jobs
              </Button>
            )}
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
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}

Index.getInitialProps = async (ctx) => {
  const filterQuery = getFilterQuery(queryString.extract(ctx.asPath));
  const [jobPage, primaryTags] = await Promise.all([
    api.getJobs({ ctx, filterQuery }),
    api.getPrimaryTags(ctx),
  ]);

  return { jobPage, primaryTags };
};

export default Index;
