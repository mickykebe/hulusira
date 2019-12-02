import Link from "next/link";
import Router from "next/router";
import Head from "next/head";
import {
  makeStyles,
  Button,
  Container,
  CircularProgress,
  Typography,
  TextField,
  MenuItem
} from "@material-ui/core";
import api from "../api";
import Layout from "../components/layout";
import JobItem from "../components/job-item";
import useIsInview from "../hooks/use-is-inview";
import TagFilter from "../components/tag-filter";
import { useEffect, Fragment } from "react";
import HeaderAd from "../components/header-ad";
import FeedAd from "../components/feed-ad";
import { useQuery } from "react-query";

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

function Index({ user, jobPage: initialJobPage, activeTagNames, primaryTags }) {
  const tags = activeTagNames.join(",");

  const { data: pages, isFetchingMore, fetchMore, canFetchMore } = useQuery(
    `tags-${tags}`,
    ({ cursor } = {}) => api.getJobs({ cursor: cursor || "", tags }),
    {
      paginated: true,
      getCanFetchMore: lastPage => {
        return lastPage.nextCursor;
      },
      initialData: [initialJobPage]
    }
  );

  const loadMore = async () => {
    try {
      const lastPage = pages[pages.length - 1];
      await fetchMore({
        cursor: lastPage.nextCursor
      });
    } catch {}
  };

  const classes = useStyles();

  const [isIntersecting, sentinelRef] = useIsInview(300);
  useEffect(() => {
    if (isIntersecting && canFetchMore && !isFetchingMore) {
      loadMore();
    }
  }, [isIntersecting, canFetchMore, isFetchingMore, loadMore]);
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
            fullWidth>
            {primaryTags.map(tag => (
              <MenuItem
                className={classes.categoryItem}
                key={tag.name}
                value={tag.name}>
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
          {pages &&
            pages.map(page => {
              return page.jobs.map(({ job, company }, index) => {
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
              });
            })}
          <div ref={sentinelRef} style={{ height: "1px" }} />
          {pages && pages.length === 1 && pages[0].jobs.length === 0 && (
            <Typography
              variant="h4"
              color="textSecondary"
              align="center"
              className={classes.nothingFound}>
              😬 <br /> Nothing Found
            </Typography>
          )}
        </Fragment>
        {isFetchingMore && (
          <CircularProgress
            classes={{ root: classes.jobsLoadingSpinner }}
            color="primary"
          />
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
