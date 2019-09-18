import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { Box, Typography, Chip, Link as MuiLink } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CompanyLogo from "../components/company-logo";

const useStyles = makeStyles(theme => ({
  root: props => ({
    position: "relative",
    display: "flex",
    padding: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
    border: `1px solid ${theme.palette.grey[200]}`,
    backgroundColor: theme.palette.common.white,
    alignItems: "center",
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
    border: `1px solid ${theme.palette.grey[800]}`,
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontWeight: 800,
    fontSize: 11,
    color: theme.palette.grey[800]
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
    color: theme.palette.getContrastText(theme.palette.secondary.main),
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    borderRadius: "0 0 0 5px",
    fontWeight: 800,
    fontSize: 12
  }
}));

export default function JobItem({
  company,
  job,
  tags,
  preview = false,
  className = ""
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
              />
            );
          })}
        </Box>
      </Box>
      {job.jobType && <Box className={classes.jobType}>{job.jobType}</Box>}
    </Box>
  );
}
