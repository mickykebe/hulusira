import React, { Fragment } from "react";
import Link from "next/link";
import Router from "next/router";
import isAfter from "date-fns/isAfter";
import formatDistance from "date-fns/formatDistance";
import endOfDay from "date-fns/endOfDay";
import clsx from "clsx";
import {
  Box,
  Typography,
  Chip,
  Link as MuiLink,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CompanyLogo from "../components/company-logo";

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
    backgroundColor: theme.palette.common.white,
    alignItems: "center",
    /* "@media (min-width: 960px)": {
      boxShadow: "4px 4px 24px hsl(0deg 0% 62% / 25%)",
    },
    boxShadow: "0 0 24px hsl(0deg 0% 51% / 25%)", */
    boxShadow: "0 2px 8px hsl(0deg 0% 62% / 25%)",
    ...(props.preview && {
      position: "sticky",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1110,
    }),
  }),
  position: {
    wordWrap: "break-word",
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "1rem",
    "@media (min-width: 960px)": {
      fontWeight: 500,
    },
  },
  company: {
    wordWrap: "break-word",
    color: theme.palette.grey[600],
    fontSize: "0.875rem",
    "@media (min-width: 960px)": {
      fontWeight: 400,
    },
  },
  tagChip: {
    border: `2px solid ${theme.palette.grey[600]}`,
    padding: theme.spacing(0.5),
    borderRadius: 8,
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    fontWeight: 500,
    fontSize: theme.spacing(1.5),
    color: theme.palette.grey[600],
  },
  tagChipLabel: {
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
  },
  applyButton: {
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  extrasText: {
    display: "inline-flex",
    alignItems: "center",
    marginRight: theme.spacing(1),
    paddingBottom: theme.spacing(0.5),
  },
  dateText: {
    position: "absolute",
    bottom: theme.spacing(1),
    right: theme.spacing(1),
  },
  /*   stamp: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-22.5deg)",
    borderWidth: "0.5rem",
    borderStyle: "double",
    padding: `0.5rem`,
    fontSize: "0.8rem",
    borderRadius: "1rem",
    textTransform: "uppercase",
    fontWeight: 700,
    WebkitMaskImage:
      "url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/8399/grunge.png)",
    WebkitMaskSize: "944px 604px",
    fontFamily: "Courier",
    zIndex: 100,
  },
  expiredStamp: {
    borderColor: "rgb(229, 57, 53)",
    color: "rgb(229, 57, 53)",
  },
  closedStamp: {
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
  }, */
  closedChip: {
    padding: theme.spacing(0.5),
    borderRadius: 8,
    marginLeft: theme.spacing(1),
    fontWeight: 500,
    fontSize: theme.spacing(1.5),
    backgroundColor: theme.palette.grey[800],
    color: "white",
  },
  expiredChip: {
    padding: theme.spacing(0.5),
    borderRadius: 8,
    marginLeft: theme.spacing(1),
    fontWeight: 500,
    fontSize: theme.spacing(1.5),
    backgroundColor: "rgb(229, 57, 53)",
    color: "white",
  },
}));

function ExpirationTag({ deadline }) {
  const expired = isAfter(new Date(), endOfDay(deadline));
  const classes = useStyles();
  return expired ? (
    <Typography className={clsx(classes.stamp, classes.expiredStamp)}>
      Expired
    </Typography>
  ) : null;
}

function ClosedTag() {
  const classes = useStyles();
  return (
    <Typography
      className={clsx(classes.stamp, classes.closedStamp)}
      variant="caption">
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
  onTagClick,
}) {
  const classes = useStyles({ preview });
  const theme = useTheme();
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const renderChips = (
    <Box display="flex" flexWrap="wrap" flex="1" py={{ xs: 1, md: 0 }}>
      {tags.map((tag) => {
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
  );

  return (
    <Box
      py={{ xs: 1, md: 1.5 }}
      px={{ xs: 2, md: 2.5 }}
      borderRadius={{ sm: 0, md: 12 }}
      className={clsx(classes.root, className)}>
      <Box pr={[2, 3]}>
        {!!company && (
          <CompanyLogo
            size="small"
            company={company}
            onClick={
              !preview ? () => Router.push(`/companies/${company.id}`) : null
            }
          />
        )}
      </Box>
      <Box display="flex" mb={1} flex={1} flexDirection="column">
        {preview ? (
          <Typography className={classes.position}>
            {job.position || "Position"}
          </Typography>
        ) : (
          <Box display="flex" alignItems="center">
            <Link href={`/jobs/${job.slug}`} passHref>
              <MuiLink classes={{ root: classes.position }} color="inherit">
                {job.position}
              </MuiLink>
            </Link>
            {!preview && job.approvalStatus === "Closed" && (
              <Chip
                label="Closed"
                size="small"
                classes={{ root: classes.closedChip }}
              />
            )}
            {!preview &&
              job.approvalStatus !== "Closed" &&
              job.deadline &&
              isAfter(new Date(), endOfDay(new Date(job.deadline))) && (
                <Chip
                  label="Expired"
                  size="small"
                  classes={{ root: classes.expiredChip }}
                />
              )}
          </Box>
        )}
        {company && (
          <React.Fragment>
            {preview ? (
              <Typography className={classes.company} gutterBottom>
                {company.name || "Company"}
              </Typography>
            ) : (
              <Link
                href="/companies/[id]"
                as={`/companies/${company.id}`}
                passHref>
                <MuiLink className={classes.company} gutterBottom>
                  {company.name}
                </MuiLink>
              </Link>
            )}
          </React.Fragment>
        )}
        {xsScreen ? renderChips : null}

        {/* {(!preview || !!job.jobType) && (
            <Box
              display="flex"
              alignItems="center"
              pt="1rem"
              pb="0.5rem"
              flexWrap="wrap">
              {!!job.jobType && (
                <Typography
                  className={classes.extrasText}
                  color="textSecondary"
                  variant="body2">
                  📌 {job.jobType}
                </Typography>
              )}
              {!preview && (
                <Typography
                  className={classes.extrasText}
                  color="textSecondary"
                  variant="body2">
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
                  variant="body2">
                  👀 {job.views ? job.views : 0}{" "}
                  {`View${job.views === 1 ? "" : "s"}`}
                </Typography>
              )}
            </Box>
          )} */}
        {/* {!preview && job.approvalStatus === "Closed" && <ClosedTag />}
        {!preview && job.approvalStatus !== "Closed" && job.deadline && (
          <ExpirationTag deadline={new Date(job.deadline)} />
        )} */}
      </Box>
      {!xsScreen ? renderChips : null}
      {!preview && (
        <Typography
          className={classes.dateText}
          color="textSecondary"
          variant="caption">
          {formatDistance(
            job.created ? new Date(job.created) : new Date(),
            new Date()
          )}
        </Typography>
      )}
    </Box>
  );
}
