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

const useStyles = makeStyles(theme => (***REMOVED***
  jobItem: ***REMOVED***
    marginBottom: theme.spacing(2)
  ***REMOVED***,
  jobsLoadingSpinner: ***REMOVED***
    display: "block",
    margin: "0 auto"
  ***REMOVED***,
  categorySelect: ***REMOVED***
    marginBottom: theme.spacing(2),
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

function Index(***REMOVED*** user, jobPage, activeTags, primaryTags ***REMOVED***) ***REMOVED***
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
  const handleTagClick = tagId => ***REMOVED***
    const tagIndex = activeTags.findIndex(tag => tag.id === tagId);
    if (tagIndex !== -1) ***REMOVED***
      return;
    ***REMOVED***
    const tagIds = activeTags.map(tag => tag.id);
    const tags = `$***REMOVED***tagId***REMOVED***$***REMOVED***tagIds.length > 0 ? `,$***REMOVED***tagIds.join(",")***REMOVED***` : ""***REMOVED***`;
    Router.push(`/?tags=$***REMOVED***tags***REMOVED***`);
  ***REMOVED***;

  const removeTagFromFilter = tagId => ***REMOVED***
    const tagIds = activeTags
      .filter(tag => tag.id !== tagId)
      .map(tag => tag.id);
    Router.push(`/$***REMOVED***tagIds.length ? `?tags=$***REMOVED***tagIds.join(",")***REMOVED***` : ""***REMOVED***`);
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
      <Container maxWidth="md">
        <HeaderAd />
        ***REMOVED***(!activeTags || activeTags.length === 0) && (
          <TextField
            value=""
            select
            className=***REMOVED***classes.categorySelect***REMOVED***
            label="Select"
            onChange=***REMOVED***ev => ***REMOVED***
              const tagId = ev.target.value;
              handleTagClick(tagId);
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
                key=***REMOVED***tag.id***REMOVED***
                value=***REMOVED***tag.id***REMOVED***>
                ***REMOVED***tag.name***REMOVED***
              </MenuItem>
            ))***REMOVED***
          </TextField>
        )***REMOVED***
        <Fragment>
          ***REMOVED***activeTags.length > 0 && (
            <TagFilter tags=***REMOVED***activeTags***REMOVED*** onTagRemove=***REMOVED***removeTagFromFilter***REMOVED*** />
          )***REMOVED***
          ***REMOVED***jobs.map((***REMOVED*** job, company ***REMOVED***, index) => ***REMOVED***
            return (
              <Fragment key=***REMOVED***job.id***REMOVED***>
                ***REMOVED***process.env.NODE_ENV === "production" &&
                  index % 4 === 0 &&
                  index > 0 && (
                    <Fragment>
                      <script
                        async
                        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                      <ins
                        className="adsbygoogle"
                        style=***REMOVED******REMOVED*** display: "block" ***REMOVED******REMOVED***
                        data-ad-format="fluid"
                        data-ad-layout-key="-ha-6+1u-6q+8y"
                        data-ad-client="ca-pub-1430919979045648"
                        data-ad-slot="8888209775"></ins>
                      <script
                        dangerouslySetInnerHTML=***REMOVED******REMOVED***
                          __html:
                            "(adsbygoogle = window.adsbygoogle || []).push(***REMOVED******REMOVED***);"
                        ***REMOVED******REMOVED***></script>
                    </Fragment>
                  )***REMOVED***
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
  const [jobPage, primaryTags] = await Promise.all([
    api.getJobs(***REMOVED*** ctx, tags ***REMOVED***),
    api.getPrimaryTags(ctx)
  ]);
  let activeTags = [];
  if (!!tags) ***REMOVED***
    activeTags = await api.getTags(tags, ctx);
  ***REMOVED***
  return ***REMOVED*** jobPage, activeTags, primaryTags ***REMOVED***;
***REMOVED***;

export default Index;
