import React, { Fragment } from "react";
import Link from "next/link";
import Router from "next/router";
import isAfter from "date-fns/isAfter";
import formatDistance from "date-fns/formatDistance";
import endOfDay from "date-fns/endOfDay";
import clsx from "clsx";
import { Box, Typography, Chip, Link as MuiLink } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CompanyLogo from "../components/company-logo";

const useStyles = makeStyles(theme => ({
  root: props => ({
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
    padding: `0.5rem 1rem`,
    border: `1px solid ${theme.palette.grey[200]}`,
    backgroundColor: theme.palette.common.white,
    alignItems: "center",
    borderRadius: 4,
    boxShadow: theme.boxShadows[0],
    ...(props.preview && {
      position: "sticky",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1110
    })
  }),
  logoSmall: {
    width: 48,
    height: 48
  },
  position: {
    display: "block"
  },
  tagChip: {
    border: `1px solid ${theme.palette.grey[700]}`,
    marginRight: "0.5rem",
    marginBottom: "0.5rem",
    fontWeight: 800,
    fontSize: ".6875rem",
    color: theme.palette.grey[700]
  },
  tagChipLabel: {
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem"
  },
  applyButton: {
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  extrasText: {
    display: "inline-flex",
    alignItems: "center",
    marginRight: theme.spacing(1),
    paddingBottom: theme.spacing(0.5)
  },
  expiredTag: {
    padding: `0 0.25rem`,
    border: "1px solid rgb(229, 57, 53)",
    color: "rgb(229, 57, 53)"
  },
  closedTag: {
    padding: `0 0.25rem`,
    backgroundColor: "rgb(229, 57, 53)",
    color: "white"
  }
}));

function ExpirationTag({ deadline }) {
  const expired = isAfter(new Date(), endOfDay(deadline));
  const classes = useStyles();
  return expired ? (
    <Typography
      className={clsx(classes.extrasText, classes.expiredTag)}
      variant="caption"
    >
      Expired
    </Typography>
  ) : null;
}

function ClosedTag() {
  const classes = useStyles();
  return (
    <Typography
      className={clsx(classes.extrasText, classes.closedTag)}
      variant="caption"
    >
      Closed
    </Typography>
  );
}

export default function JobItem({
  company,
  job,
  tags,
  preview = false,
  className = "",
  onTagClick
}) {
  const classes = useStyles({ preview });

  return (
    <Box className={clsx(classes.root, className)}>
      <Box display="flex" alignItems="center" flex="1 0 26rem" pr={2}>
        <Box className={classes.logoWrapper} pr={[2, 3]}>
          {!!company && (
            <CompanyLogo
              company={company}
              onClick={
                !preview ? () => Router.push(`/companies/${company.id}`) : null
              }
            />
          )}
        </Box>
        <Box mb={1} flex={1}>
          {preview ? (
            <Typography variant="h6">{job.position || "Position"}</Typography>
          ) : (
            <Link href="/jobs/[slug]" as={`/jobs/${job.slug}`} passHref>
              <MuiLink
                classes={{ root: classes.position }}
                variant="h6"
                color="inherit"
              >
                {job.position}
              </MuiLink>
            </Link>
          )}
          {company && (
            <React.Fragment>
              <Typography variant="body1" component="span">
                at&nbsp;
              </Typography>
              {preview ? (
                <Typography variant="subtitle2" component="span" gutterBottom>
                  {company.name || "Company"}
                </Typography>
              ) : (
                <Link
                  href="/companies/[id]"
                  as={`/companies/${company.id}`}
                  passHref
                >
                  <MuiLink variant="subtitle2" color="inherit" gutterBottom>
                    {company.name}
                  </MuiLink>
                </Link>
              )}
            </React.Fragment>
          )}
          {(!preview || !!job.jobType) && (
            <Box
              display="flex"
              alignItems="center"
              pt="1rem"
              pb="0.5rem"
              flexWrap="wrap"
            >
              {!!job.jobType && (
                <Typography
                  className={classes.extrasText}
                  color="textSecondary"
                  variant="body2"
                >
                  📌 {job.jobType}
                </Typography>
              )}
              {!preview && (
                <Typography
                  className={classes.extrasText}
                  color="textSecondary"
                  variant="body2"
                >
                  ⏱️{" "}
                  {formatDistance(
                    job.created ? new Date(job.created) : new Date(),
                    new Date(),
                    { addSuffix: true }
                  )}
                </Typography>
              )}
              {!preview && (
                <Typography
                  className={classes.extrasText}
                  color="textSecondary"
                  variant="body2"
                >
                  👀 {job.views ? job.views : 0}{" "}
                  {`View${job.views === 1 ? "" : "s"}`}
                </Typography>
              )}
              {!preview && job.approvalStatus !== "Closed" && job.deadline && (
                <ExpirationTag deadline={new Date(job.deadline)} />
              )}
              {!preview && job.approvalStatus === "Closed" && <ClosedTag />}
            </Box>
          )}
        </Box>
      </Box>
      <Box display="flex" flexWrap="wrap" flex="1">
        {tags.map(tag => {
          let tagName = typeof tag === "object" ? tag.name : tag;
          return (
            <Chip
              key={tagName}
              classes={{ root: classes.tagChip, label: classes.tagChipLabel }}
              label={tagName}
              variant="outlined"
              size="small"
              onClick={!!onTagClick ? () => onTagClick(tag.name) : null}
            />
          );
        })}
      </Box>
    </Box>
  );
}
