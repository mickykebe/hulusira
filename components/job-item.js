import React from "react";
import Link from "next/link";
import clsx from "clsx";
import ***REMOVED*** Box, Typography, Chip, Link as MuiLink ***REMOVED*** from "@material-ui/core";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";
import CompanyLogo from "../components/company-logo";

const useStyles = makeStyles(theme => (***REMOVED***
  root: props => (***REMOVED***
    position: "relative",
    display: "flex",
    padding: `$***REMOVED***theme.spacing(4)***REMOVED***px $***REMOVED***theme.spacing(2)***REMOVED***px`,
    border: `1px solid $***REMOVED***theme.palette.grey[200]***REMOVED***`,
    backgroundColor: theme.palette.common.white,
    alignItems: "center",
    boxShadow: theme.boxShadows[0],
    ...(props.preview && ***REMOVED***
      position: "sticky",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1110
    ***REMOVED***)
  ***REMOVED***),
  logoWrapper: ***REMOVED***
    "@media (max-width: 400px)": ***REMOVED***
      display: "none"
    ***REMOVED***
  ***REMOVED***,
  logoSmall: ***REMOVED***
    width: 48,
    height: 48
  ***REMOVED***,
  position: ***REMOVED***
    display: "block"
  ***REMOVED***,
  tagChip: ***REMOVED***
    border: `1px solid $***REMOVED***theme.palette.grey[800]***REMOVED***`,
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontWeight: 800,
    fontSize: 11,
    color: theme.palette.grey[800]
  ***REMOVED***,
  applyButton: ***REMOVED***
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down("xs")]: ***REMOVED***
      display: "none"
    ***REMOVED***
  ***REMOVED***,
  jobType: ***REMOVED***
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.getContrastText(theme.palette.secondary.main),
    padding: `$***REMOVED***theme.spacing(0.5)***REMOVED***px $***REMOVED***theme.spacing(1)***REMOVED***px`,
    borderRadius: "0 0 0 5px",
    fontWeight: 800,
    fontSize: 12
  ***REMOVED***
***REMOVED***));

export default function JobItem(***REMOVED***
  company,
  job,
  tags,
  preview = false,
  className = ""
***REMOVED***) ***REMOVED***
  const classes = useStyles(***REMOVED*** preview ***REMOVED***);

  return (
    <Box className=***REMOVED***clsx(classes.root, className)***REMOVED***>
      <Box className=***REMOVED***classes.logoWrapper***REMOVED*** pr=***REMOVED***3***REMOVED***>
        ***REMOVED***!!company && <CompanyLogo company=***REMOVED***company***REMOVED*** />***REMOVED***
      </Box>
      <Box display="flex" alignItems="center" flexWrap="wrap" flex=***REMOVED***1***REMOVED***>
        <Box mb=***REMOVED***1***REMOVED*** flex=***REMOVED***1***REMOVED*** flexBasis=***REMOVED***300***REMOVED***>
          ***REMOVED***preview ? (
            <Typography variant="h6">***REMOVED***job.position || "Position"***REMOVED***</Typography>
          ) : (
            <Link href="/jobs/[slug]" as=***REMOVED***`/jobs/$***REMOVED***job.slug***REMOVED***`***REMOVED*** passHref>
              <MuiLink
                classes=***REMOVED******REMOVED*** root: classes.position ***REMOVED******REMOVED***
                variant="h6"
                color="inherit">
                ***REMOVED***job.position***REMOVED***
              </MuiLink>
            </Link>
          )***REMOVED***
          ***REMOVED***company && (
            <React.Fragment>
              <Typography variant="body1" component="span">
                at&nbsp;
              </Typography>
              <Typography variant="subtitle2" component="span" gutterBottom>
                ***REMOVED***company.name || "Company"***REMOVED***
              </Typography>
            </React.Fragment>
          )***REMOVED***
        </Box>
        <Box>
          ***REMOVED***tags.map(tag => ***REMOVED***
            let tagName = typeof tag === "object" ? tag.name : tag;
            return (
              <Chip
                key=***REMOVED***tagName***REMOVED***
                classes=***REMOVED******REMOVED*** root: classes.tagChip ***REMOVED******REMOVED***
                label=***REMOVED***tagName***REMOVED***
                variant="outlined"
                size="small"
              />
            );
          ***REMOVED***)***REMOVED***
        </Box>
      </Box>
      ***REMOVED***job.jobType && <Box className=***REMOVED***classes.jobType***REMOVED***>***REMOVED***job.jobType***REMOVED***</Box>***REMOVED***
    </Box>
  );
***REMOVED***
