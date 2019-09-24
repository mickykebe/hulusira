import React from "react";
import Link from "next/link";
import formatDistance from "date-fns/formatDistance";
import clsx from "clsx";
import { Box, Typography, Chip, Link as MuiLink } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import DescriptionIcon from "@material-ui/icons/Description";
import ScheduleIcon from "@material-ui/icons/Schedule";
import CompanyLogo from "../components/company-logo";

const useStyles = makeStyles(theme => ({
  root: props => ({
    position: "relative",
    display: "flex",
    padding: `${theme.spacing(3)}px ${theme.spacing(2)}px`,
    border: `1px solid ${theme.palette.grey[200]}`,
    backgroundColor: theme.palette.common.white,
    alignItems: "center",
    borderRadius: 4,
    border: `1px solid #EAEDF3`,
    boxShadow: theme.boxShadows[0],
    ...(props.preview && {
      position: "sticky",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1110
    })
  }),
  logoWrapper: {
    "@media (max-width: 400px)": {
      display: "none"
    }
  },
  logoSmall: {
    width: 48,
    height: 48
  },
  position: {
    display: "block"
  },
  tagChip: {
    border: `1px solid ${theme.palette.grey[700]}`,
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontWeight: 800,
    fontSize: 11,
    color: theme.palette.grey[700]
  },
  applyButton: {
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  jobType: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.getContrastText(theme.palette.grey[700]),
    padding: `2px ${theme.spacing(1)}px`,
    borderRadius: "0 0 0 5px",
    fontWeight: 800,
    fontSize: 12
  },
  extrasText: {
    display: "inline-flex",
    alignItems: "center",
    marginRight: theme.spacing(1)
  },
  extrasIcon: {
    fontSize: 16,
    marginRight: theme.spacing(0.5)
  }
}));

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
      <Box className={classes.logoWrapper} pr={3}>
        {!!company && <CompanyLogo company={company} />}
      </Box>
      <Box display="flex" alignItems="center" flexWrap="wrap" flex={1}>
        <Box mb={1} flex={1} flexBasis={300}>
          {preview ? (
            <Typography variant="h6">{job.position || "Position"}</Typography>
          ) : (
            <Link href="/jobs/[slug]" as={`/jobs/${job.slug}`} passHref>
              <MuiLink
                classes={{ root: classes.position }}
                variant="h6"
                color="inherit">
                {job.position}
              </MuiLink>
            </Link>
          )}
          {company && (
            <React.Fragment>
              <Typography variant="body1" component="span">
                at&nbsp;
              </Typography>
              <Typography variant="subtitle2" component="span" gutterBottom>
                {company.name || "Company"}
              </Typography>
            </React.Fragment>
          )}
          {(!preview || !!job.jobType) && (
            <Box display="flex" alignItems="center" pt={2}>
              {!!job.jobType && (
                <Typography
                  className={classes.extrasText}
                  color="textSecondary"
                  variant="body2">
                  <DescriptionIcon className={classes.extrasIcon} />{" "}
                  {job.jobType}
                </Typography>
              )}
              {!preview && (
                <Typography
                  className={classes.extrasText}
                  color="textSecondary"
                  variant="body2">
                  <ScheduleIcon className={classes.extrasIcon} />
                  {formatDistance(
                    job.created ? new Date(job.created) : new Date(),
                    new Date(),
                    { addSuffix: true }
                  )}
                </Typography>
              )}
            </Box>
          )}
        </Box>
        <Box>
          {tags.map(tag => {
            let tagName = typeof tag === "object" ? tag.name : tag;
            return (
              <Chip
                key={tagName}
                classes={{ root: classes.tagChip }}
                label={tagName}
                variant="outlined"
                size="small"
                onClick={!!onTagClick ? () => onTagClick(tag.id) : null}
              />
            );
          })}
        </Box>
      </Box>
      {/* {job.jobType && <Box className={classes.jobType}>{job.jobType}</Box>} */}
    </Box>
  );
}
