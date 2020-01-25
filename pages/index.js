import Link from "next/link";
import Router, ***REMOVED*** useRouter ***REMOVED*** from "next/router";
import Head from "next/head";
import ***REMOVED***
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
  ExpansionPanelDetails
***REMOVED*** from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import RefreshIcon from "@material-ui/icons/Refresh";
import api from "../api";
import Layout from "../components/layout";
import JobItem from "../components/job-item";
import useIsInview from "../hooks/use-is-inview";
import TagFilter from "../components/tag-filter";
import ***REMOVED*** useEffect, useRef, Fragment, useCallback, useState ***REMOVED*** from "react";
import HeaderAd from "../components/header-ad";
import FeedAd from "../components/feed-ad";
import JobFilterPanels from "../components/job-filter-panels";
import queryString from "query-string";
import HSPaper from "../components/hs-paper";

const useStyles = makeStyles(theme => (***REMOVED***
  root: ***REMOVED***
    paddingTop: theme.spacing(2)
  ***REMOVED***,
  wrapperGrid: ***REMOVED***
    display: "grid",
    gridTemplateColumns: "1fr 3fr",
    gridTemplateRows: "minmax(0, 80px) 1fr",
    gridGap: "1.5rem",
    alignItems: "start",
    [theme.breakpoints.down("sm")]: ***REMOVED***
      gridTemplateColumns: "1fr",
      gridTemplateRows: "1fr"
    ***REMOVED***
  ***REMOVED***,
  filterColumn: ***REMOVED***
    gridRow: "span 2",
    [theme.breakpoints.down("sm")]: ***REMOVED***
      gridRow: "span 1"
    ***REMOVED***
  ***REMOVED***,
  headerAd: ***REMOVED***
    [theme.breakpoints.down("sm")]: ***REMOVED***
      order: "-1"
    ***REMOVED***
  ***REMOVED***,
  filterExpansionPanel: ***REMOVED***
    boxShadow: "none",
    backgroundColor: "inherit",
    "&::before": ***REMOVED***
      display: "none"
    ***REMOVED***
  ***REMOVED***,
  filterPanelSummary: ***REMOVED***
    padding: "0 1rem"
  ***REMOVED***,
  filterPanelDetails: ***REMOVED***
    padding: 0
  ***REMOVED***,
  filterHead: (***REMOVED*** smallScreen ***REMOVED***) => ***REMOVED***
    return ***REMOVED***
      ...(smallScreen && ***REMOVED***
        borderBottom: `1px solid $***REMOVED***theme.palette.grey[400]***REMOVED***`,
        borderTop: `1px solid $***REMOVED***theme.palette.grey[400]***REMOVED***`
      ***REMOVED***),
      ...(!smallScreen && ***REMOVED***
        paddingBottom: `0.5rem`
      ***REMOVED***)
    ***REMOVED***;
  ***REMOVED***,
  jobItem: ***REMOVED***
    marginBottom: `0.5rem`
  ***REMOVED***,
  feedAd: ***REMOVED***
    marginBottom: `0.5rem`
  ***REMOVED***,
  jobsLoadingSpinner: ***REMOVED***
    display: "block",
    margin: "0 auto"
  ***REMOVED***,
  categorySelect: ***REMOVED***
    marginTop: theme.spacing(2),
    background: theme.palette.common.white
  ***REMOVED***,
  categoryItem: ***REMOVED***
    fontWeight: 800,
    padding: `$***REMOVED***theme.spacing(1)***REMOVED***px $***REMOVED***theme.spacing(2)***REMOVED***px`,
    fontSize: "0.8rem"
  ***REMOVED***,
  nothingFound: ***REMOVED***
    paddingTop: theme.spacing(4)
  ***REMOVED***
***REMOVED***));

function getFilterQuery(queryPath) ***REMOVED***
  const queryParams = queryString.parse(queryPath, ***REMOVED***
    arrayFormat: "bracket"
  ***REMOVED***);
  return queryString.stringify(
    ***REMOVED***
      tags: queryParams.tags,
      jobTypes: queryParams.jobTypes,
      careerLevels: queryParams.careerLevels
    ***REMOVED***,
    ***REMOVED*** arrayFormat: "bracket" ***REMOVED***
  );
***REMOVED***

const pageTitle = "Hulusira - Jobs in Ethiopia";
const pageUrl = `$***REMOVED***process.env.ROOT_URL***REMOVED***/`;
const pageDescription =
  "HuluSira is a job board for jobs based in Ethiopia. We aim to make the job posting and dissemination process as simple as possible. Get workers hired.";

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
    case "TAG_FILTER": ***REMOVED***
      return ***REMOVED***
        ...state,
        isLoading: false,
        isError: false,
        jobs: action.payload.jobs,
        nextCursor: action.payload.nextCursor
      ***REMOVED***;
    ***REMOVED***
    default:
      throw new Error("Invalid action type for jobsReducer");
  ***REMOVED***
***REMOVED***;

function Index(***REMOVED*** user, jobPage, primaryTags ***REMOVED***) ***REMOVED***
  const [***REMOVED*** jobs, nextCursor, isLoading, isError ***REMOVED***, dispatch] = React.useReducer(
    jobsReducer,
    ***REMOVED***
      jobs: jobPage.jobs,
      nextCursor: jobPage.nextCursor,
      isLoading: false,
      isError: false
    ***REMOVED***
  );
  const ticker = useRef(0);
  useEffect(() => ***REMOVED***
    if (ticker.current > 0) ***REMOVED***
      dispatch(***REMOVED*** type: "TAG_FILTER", payload: jobPage ***REMOVED***);
    ***REMOVED***
    ticker.current++;
  ***REMOVED***, [jobPage]);

  const router = useRouter();
  const parsedQS = queryString.parse(queryString.extract(router.asPath), ***REMOVED***
    arrayFormat: "bracket"
  ***REMOVED***);
  const activeTagNames = parsedQS.tags || [];
  const hasActiveFilter =
    parsedQS.tags || parsedQS.jobTypes || parsedQS.careerLevels;
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [filterCollapsed, setFilterCollapsed] = useState(true);
  const classes = useStyles(***REMOVED*** smallScreen ***REMOVED***);

  const fetchMoreJobs = useCallback(async () => ***REMOVED***
    const tickerVal = ticker.current;
    if (isLoading || !nextCursor) ***REMOVED***
      return;
    ***REMOVED***
    dispatch(***REMOVED*** type: "FETCH_INIT" ***REMOVED***);
    try ***REMOVED***
      const filterQuery = getFilterQuery(location.search);
      const jobPage = await api.getJobs(***REMOVED***
        filterQuery,
        cursor: nextCursor
      ***REMOVED***);
      if (tickerVal === ticker.current) ***REMOVED***
        dispatch(***REMOVED*** type: "FETCH_SUCCESS", payload: jobPage ***REMOVED***);
      ***REMOVED***
    ***REMOVED*** catch (err) ***REMOVED***
      if (tickerVal === ticker.current) ***REMOVED***
        dispatch(***REMOVED*** type: "FETCH_FAILURE" ***REMOVED***);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***, [isLoading, nextCursor]);

  const [isIntersecting, sentinelRef] = useIsInview(300);
  useEffect(() => ***REMOVED***
    if (isIntersecting) ***REMOVED***
      fetchMoreJobs();
    ***REMOVED***
  ***REMOVED***, [fetchMoreJobs, isIntersecting]);
  const addFilter = (key, value) => ***REMOVED***
    const parsed = queryString.parse(location.search, ***REMOVED***
      arrayFormat: "bracket"
    ***REMOVED***);
    if (!parsed[key]) ***REMOVED***
      parsed[key] = [value];
    ***REMOVED*** else ***REMOVED***
      if (parsed[key].indexOf(value) !== -1) ***REMOVED***
        return;
      ***REMOVED***
      parsed[key].push(value);
    ***REMOVED***
    Router.push(
      `/?$***REMOVED***queryString.stringify(parsed, ***REMOVED*** arrayFormat: "bracket" ***REMOVED***)***REMOVED***`
    );
  ***REMOVED***;
  const addTagToFilter = tagName => ***REMOVED***
    addFilter("tags", tagName);
  ***REMOVED***;

  const removeFilter = (key, value) => ***REMOVED***
    const parsed = queryString.parse(location.search, ***REMOVED***
      arrayFormat: "bracket"
    ***REMOVED***);
    if (parsed[key] && parsed[key].length > 0) ***REMOVED***
      parsed[key] = parsed[key].filter(val => ***REMOVED***
        return val !== value;
      ***REMOVED***);
      Router.push(
        `/?$***REMOVED***queryString.stringify(parsed, ***REMOVED*** arrayFormat: "bracket" ***REMOVED***)***REMOVED***`
      );
    ***REMOVED***
  ***REMOVED***;
  const clearFilter = key => () => ***REMOVED***
    const parsed = queryString.parse(location.search, ***REMOVED***
      arrayFormat: "bracket"
    ***REMOVED***);
    if (parsed[key] && parsed[key].length > 0) ***REMOVED***
      parsed[key] = [];
    ***REMOVED***
    Router.push(
      `/?$***REMOVED***queryString.stringify(parsed, ***REMOVED*** arrayFormat: "bracket" ***REMOVED***)***REMOVED***`
    );
  ***REMOVED***;
  const removeTagFromFilter = tagName => ***REMOVED***
    removeFilter("tags", tagName);
  ***REMOVED***;

  const metaImage = `$***REMOVED***process.env.ROOT_URL***REMOVED***/static/hulusira.png`;
  return (
    <Layout
      user=***REMOVED***user***REMOVED***
      toolbarChildren=***REMOVED***
        user ? null : (
          <Fragment>
            <Link href="/new" passHref>
              <Button variant="contained" color="primary">
                Post a Job
              </Button>
            </Link>
          </Fragment>
        )
      ***REMOVED***
    >
      <Head>
        <title>***REMOVED***pageTitle***REMOVED***</title>
        <meta name="description" content=***REMOVED***pageDescription***REMOVED*** />
        <meta property="og:title" content=***REMOVED***pageTitle***REMOVED*** />
        <meta property="og:url" content=***REMOVED***pageUrl***REMOVED*** />
        <meta property="og:description" content=***REMOVED***pageDescription***REMOVED*** />
        <meta property="og:image" content=***REMOVED***metaImage***REMOVED*** />
        <meta name="twitter:title" content=***REMOVED***pageTitle***REMOVED*** />
        <meta name="twitter:description" content=***REMOVED***pageDescription***REMOVED*** />
        <meta name="twitter:image:src" content=***REMOVED***metaImage***REMOVED*** />
        <meta name="twitter:url" content=***REMOVED***pageUrl***REMOVED*** />
      </Head>
      <Container className=***REMOVED***classes.root***REMOVED*** maxWidth="xl">
        <Box className=***REMOVED***classes.wrapperGrid***REMOVED***>
          <HSPaper className=***REMOVED***classes.filterColumn***REMOVED***>
            ***REMOVED***smallScreen && (
              <ExpansionPanel
                classes=***REMOVED******REMOVED***
                  root: classes.filterExpansionPanel
                ***REMOVED******REMOVED***
                expanded=***REMOVED***!filterCollapsed***REMOVED***
                onChange=***REMOVED***(_ev, isExpanded) => ***REMOVED***
                  setFilterCollapsed(!isExpanded);
                ***REMOVED******REMOVED***
              >
                <ExpansionPanelSummary
                  classes=***REMOVED******REMOVED***
                    root: classes.filterPanelSummary
                  ***REMOVED******REMOVED***
                  expandIcon=***REMOVED***
                    hasActiveFilter ? (
                      <Badge color="primary" variant="dot">
                        <FilterListIcon />
                      </Badge>
                    ) : (
                      <FilterListIcon />
                    )
                  ***REMOVED***
                >
                  <Typography variant="h6">Filter</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className=***REMOVED***classes.filterPanelDetails***REMOVED***>
                  <JobFilterPanels
                    tags=***REMOVED***primaryTags***REMOVED***
                    onCheckTagFilter=***REMOVED***addTagToFilter***REMOVED***
                    onUncheckTagFilter=***REMOVED***removeTagFromFilter***REMOVED***
                    onClearTagFilter=***REMOVED***clearFilter("tags")***REMOVED***
                    onCheckJobTypeFilter=***REMOVED***jobType => ***REMOVED***
                      addFilter("jobTypes", jobType);
                    ***REMOVED******REMOVED***
                    onUncheckJobTypeFilter=***REMOVED***jobType => ***REMOVED***
                      removeFilter("jobTypes", jobType);
                    ***REMOVED******REMOVED***
                    onClearJobTypeFilter=***REMOVED***clearFilter("jobTypes")***REMOVED***
                    onCheckCareerLevelFilter=***REMOVED***careerLevel => ***REMOVED***
                      addFilter("careerLevels", careerLevel);
                    ***REMOVED******REMOVED***
                    onUncheckCareerLevelFilter=***REMOVED***careerLevel => ***REMOVED***
                      removeFilter("careerLevels", careerLevel);
                    ***REMOVED******REMOVED***
                    onClearCareerLevelFilter=***REMOVED***clearFilter("careerLevels")***REMOVED***
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            )***REMOVED***
            ***REMOVED***!smallScreen && (
              <Fragment>
                <Box display="flex" alignItems="center" px="1.5rem" py="1rem">
                  <Typography variant="h6">Filter</Typography>
                </Box>
                <JobFilterPanels
                  tags=***REMOVED***primaryTags***REMOVED***
                  onCheckTagFilter=***REMOVED***addTagToFilter***REMOVED***
                  onUncheckTagFilter=***REMOVED***removeTagFromFilter***REMOVED***
                  onClearTagFilter=***REMOVED***clearFilter("tags")***REMOVED***
                  onCheckJobTypeFilter=***REMOVED***jobType => ***REMOVED***
                    addFilter("jobTypes", jobType);
                  ***REMOVED******REMOVED***
                  onUncheckJobTypeFilter=***REMOVED***jobType => ***REMOVED***
                    removeFilter("jobTypes", jobType);
                  ***REMOVED******REMOVED***
                  onClearJobTypeFilter=***REMOVED***clearFilter("jobTypes")***REMOVED***
                  onCheckCareerLevelFilter=***REMOVED***careerLevel => ***REMOVED***
                    addFilter("careerLevels", careerLevel);
                  ***REMOVED******REMOVED***
                  onUncheckCareerLevelFilter=***REMOVED***careerLevel => ***REMOVED***
                    removeFilter("careerLevels", careerLevel);
                  ***REMOVED******REMOVED***
                  onClearCareerLevelFilter=***REMOVED***clearFilter("careerLevels")***REMOVED***
                />
              </Fragment>
            )***REMOVED***
          </HSPaper>
          <HeaderAd className=***REMOVED***classes.headerAd***REMOVED*** />
          <Box>
            ***REMOVED***activeTagNames.length > 0 && (
              <TagFilter
                tagNames=***REMOVED***activeTagNames***REMOVED***
                onTagRemove=***REMOVED***removeTagFromFilter***REMOVED***
              />
            )***REMOVED***
            ***REMOVED***jobs.map((***REMOVED*** job, company ***REMOVED***, index) => ***REMOVED***
              return (
                <Fragment key=***REMOVED***job.id***REMOVED***>
                  ***REMOVED***process.env.NODE_ENV === "production" &&
                    index % 4 === 0 &&
                    index > 0 && <FeedAd className=***REMOVED***classes.feedAd***REMOVED*** />***REMOVED***
                  <JobItem
                    className=***REMOVED***classes.jobItem***REMOVED***
                    job=***REMOVED***job***REMOVED***
                    tags=***REMOVED***job.tags***REMOVED***
                    company=***REMOVED***company***REMOVED***
                    onTagClick=***REMOVED***addTagToFilter***REMOVED***
                  />
                </Fragment>
              );
            ***REMOVED***)***REMOVED***
            <div ref=***REMOVED***sentinelRef***REMOVED*** style=***REMOVED******REMOVED*** height: "1px" ***REMOVED******REMOVED*** />
            ***REMOVED***ticker.current > 0 && jobs.length === 0 && (
              <Typography
                variant="h4"
                color="textSecondary"
                align="center"
                className=***REMOVED***classes.nothingFound***REMOVED***
              >
                😬 <br /> Nothing Found
              </Typography>
            )***REMOVED***
            ***REMOVED***isLoading && (
              <CircularProgress
                classes=***REMOVED******REMOVED*** root: classes.jobsLoadingSpinner ***REMOVED******REMOVED***
                color="primary"
              />
            )***REMOVED***
            ***REMOVED***isError && (
              <Box textAlign="center">
                <Typography color="textSecondary" variant="h6">
                  Problem occurred fetching data.
                </Typography>
                <Fab
                  onClick=***REMOVED***fetchMoreJobs***REMOVED***
                  variant="extended"
                  color="primary"
                  size="medium"
                >
                  <RefreshIcon />
                  Try Again
                </Fab>
              </Box>
            )***REMOVED***
          </Box>
        </Box>
      </Container>
    </Layout>
  );
***REMOVED***

Index.getInitialProps = async ctx => ***REMOVED***
  const filterQuery = getFilterQuery(queryString.extract(ctx.asPath));
  const [jobPage, primaryTags] = await Promise.all([
    api.getJobs(***REMOVED*** ctx, filterQuery ***REMOVED***),
    api.getPrimaryTags(ctx)
  ]);

  return ***REMOVED*** jobPage, primaryTags ***REMOVED***;
***REMOVED***;

export default Index;
