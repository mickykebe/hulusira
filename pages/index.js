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
  TextField,
  MenuItem
***REMOVED*** from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import api from "../api";
import Layout from "../components/layout";
import JobItem from "../components/job-item";
import useIsInview from "../hooks/use-is-inview";
import TagFilter from "../components/tag-filter";
import ***REMOVED*** useEffect, useRef, Fragment ***REMOVED*** from "react";
import HeaderAd from "../components/header-ad";
import FeedAd from "../components/feed-ad";

const useStyles = makeStyles(theme => (***REMOVED***
  root: ***REMOVED***
    paddingTop: theme.spacing(2)
  ***REMOVED***,
  headerAd: ***REMOVED***
    marginBottom: theme.spacing(1),
  ***REMOVED***,
  jobItem: ***REMOVED***
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
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

function Index(***REMOVED*** user, jobPage, activeTagNames, primaryTags ***REMOVED***) ***REMOVED***
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

  const classes = useStyles();
  const router = useRouter();

  const fetchMoreJobs = async () => ***REMOVED***
    const tickerVal = ticker.current;
    if (isLoading || !nextCursor) ***REMOVED***
      return;
    ***REMOVED***
    dispatch(***REMOVED*** type: "FETCH_INIT" ***REMOVED***);
    try ***REMOVED***
      const jobPage = await api.getJobs(***REMOVED***
        tags: router.query.tags || "",
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
  ***REMOVED***;

  const [isIntersecting, sentinelRef] = useIsInview(300);
  useEffect(() => ***REMOVED***
    if (isIntersecting) ***REMOVED***
      fetchMoreJobs();
    ***REMOVED***
  ***REMOVED***, [isIntersecting]);
  const handleTagClick = tagName => ***REMOVED***
    const tagIndex = activeTagNames.findIndex(activeTagName => activeTagName === tagName);
    if (tagIndex !== -1) ***REMOVED***
      return;
    ***REMOVED***
    const tags = `$***REMOVED***tagName***REMOVED***$***REMOVED***activeTagNames.length > 0 ? `,$***REMOVED***activeTagNames.join(",")***REMOVED***` : ""***REMOVED***`;
    Router.push(`/?tags=$***REMOVED***tags***REMOVED***`);
  ***REMOVED***;

  const removeTagFromFilter = tagName => ***REMOVED***
    const tagNames = activeTagNames
      .filter(activeTagName => activeTagName !== tagName);
    Router.push(`/$***REMOVED***tagNames.length ? `?tags=$***REMOVED***tagNames.join(",")***REMOVED***` : ""***REMOVED***`);
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
      ***REMOVED***>
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
      <Container className=***REMOVED***classes.root***REMOVED*** maxWidth="md">
        <HeaderAd className=***REMOVED***classes.headerAd***REMOVED*** />
        ***REMOVED***(!activeTagNames || activeTagNames.length === 0) && (
          <TextField
            value=""
            select
            className=***REMOVED***classes.categorySelect***REMOVED***
            label="Select"
            onChange=***REMOVED***ev => ***REMOVED***
              const tagName = ev.target.value;
              handleTagClick(tagName);
            ***REMOVED******REMOVED***
            SelectProps=***REMOVED******REMOVED***
              MenuProps: ***REMOVED***
                className: classes.menu
              ***REMOVED***
            ***REMOVED******REMOVED***
            label="Choose category"
            margin="dense"
            variant="outlined"
            fullWidth>
            ***REMOVED***primaryTags.map(tag => (
              <MenuItem
                className=***REMOVED***classes.categoryItem***REMOVED***
                key=***REMOVED***tag.name***REMOVED***
                value=***REMOVED***tag.name***REMOVED***>
                ***REMOVED***tag.name***REMOVED***
              </MenuItem>
            ))***REMOVED***
          </TextField>
        )***REMOVED***
        <Fragment>
          ***REMOVED***activeTagNames.length > 0 && (
            <TagFilter tagNames=***REMOVED***activeTagNames***REMOVED*** onTagRemove=***REMOVED***removeTagFromFilter***REMOVED*** />
          )***REMOVED***
          ***REMOVED***jobs.map((***REMOVED*** job, company ***REMOVED***, index) => ***REMOVED***
            return (
              <Fragment key=***REMOVED***job.id***REMOVED***>
                ***REMOVED***process.env.NODE_ENV === "production" &&
                  index % 4 === 0 &&
                  index > 0 && <FeedAd />***REMOVED***
                <JobItem
                  className=***REMOVED***classes.jobItem***REMOVED***
                  job=***REMOVED***job***REMOVED***
                  tags=***REMOVED***job.tags***REMOVED***
                  company=***REMOVED***company***REMOVED***
                  onTagClick=***REMOVED***handleTagClick***REMOVED***
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
              className=***REMOVED***classes.nothingFound***REMOVED***>
              😬 <br /> Nothing Found
            </Typography>
          )***REMOVED***
        </Fragment>
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
              size="medium">
              <RefreshIcon />
              Try Again
            </Fab>
          </Box>
        )***REMOVED***
      </Container>
    </Layout>
  );
***REMOVED***

Index.getInitialProps = async ctx => ***REMOVED***
  const ***REMOVED*** tags = "" ***REMOVED*** = ctx.query;
  let activeTagNames = tags.split(",").filter(name => !!name).map(name => name.toUpperCase().trim());
  const [jobPage, primaryTags] = await Promise.all([
    api.getJobs(***REMOVED*** ctx, tags: activeTagNames.join(",") ***REMOVED***),
    api.getPrimaryTags(ctx)
  ]);
  
  return ***REMOVED*** jobPage, activeTagNames, primaryTags ***REMOVED***;
***REMOVED***;

export default Index;
