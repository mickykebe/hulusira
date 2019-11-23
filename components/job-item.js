import React, ***REMOVED*** Fragment ***REMOVED*** from "react";
import Link from "next/link";
import Router from "next/router";
import isAfter from "date-fns/isAfter";
import formatDistance from "date-fns/formatDistance";
import endOfDay from 'date-fns/endOfDay';
import clsx from "clsx";
import ***REMOVED*** Box, Typography, Chip, Link as MuiLink ***REMOVED*** from "@material-ui/core";
import ***REMOVED*** makeStyles ***REMOVED*** from "@material-ui/styles";
import DescriptionIcon from "@material-ui/icons/Description";
import VisibilityIcon from '@material-ui/icons/Visibility';
import ScheduleIcon from "@material-ui/icons/Schedule";
import CompanyLogo from "../components/company-logo";

const useStyles = makeStyles(theme => (***REMOVED***
  root: props => (***REMOVED***
    position: "relative",
    display: "flex",
    padding: `$***REMOVED***theme.spacing(1)***REMOVED***px $***REMOVED***theme.spacing(2)***REMOVED***px`,
    border: `1px solid $***REMOVED***theme.palette.grey[200]***REMOVED***`,
    backgroundColor: theme.palette.common.white,
    alignItems: "center",
    borderRadius: 4,
    border: `1px solid #EAEDF3`,
    boxShadow: theme.boxShadows[0],
    ...(props.preview && ***REMOVED***
      position: "sticky",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1110
    ***REMOVED***)
  ***REMOVED***),
  logoSmall: ***REMOVED***
    width: 48,
    height: 48
  ***REMOVED***,
  position: ***REMOVED***
    display: "block"
  ***REMOVED***,
  tagChip: ***REMOVED***
    border: `1px solid $***REMOVED***theme.palette.grey[700]***REMOVED***`,
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontWeight: 800,
    fontSize: ".6875rem",
    color: theme.palette.grey[700]
  ***REMOVED***,
  applyButton: ***REMOVED***
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down("xs")]: ***REMOVED***
      display: "none"
    ***REMOVED***
  ***REMOVED***,
  extrasText: ***REMOVED***
    display: "inline-flex",
    alignItems: "center",
    marginRight: theme.spacing(2),
  ***REMOVED***,
  expiredTag: ***REMOVED***
    padding: `0 $***REMOVED***theme.spacing(0.5)***REMOVED***px`,
    border: '1px solid rgb(229, 57, 53)',
    color: 'rgb(229, 57, 53)',
  ***REMOVED***,
  closedTag: ***REMOVED***
    padding: `0 $***REMOVED***theme.spacing(0.5)***REMOVED***px`,
    backgroundColor: 'rgb(229, 57, 53)',
    color: 'white',
  ***REMOVED***,
  extrasIcon: ***REMOVED***
    fontSize: "1rem",
    marginRight: theme.spacing(0.5)
  ***REMOVED***
***REMOVED***));

function ExpirationTag(***REMOVED*** deadline ***REMOVED***) ***REMOVED***
  const expired = isAfter(new Date(), endOfDay(deadline));
  const classes = useStyles();
  return expired ? (<Typography className=***REMOVED***clsx(classes.extrasText, classes.expiredTag)***REMOVED*** variant="caption">
    Expired
  </Typography>) : null;
***REMOVED***

function ClosedTag() ***REMOVED***
  const classes = useStyles();
  return (<Typography className=***REMOVED***clsx(classes.extrasText, classes.closedTag)***REMOVED*** variant="caption">
    Closed
  </Typography>);
***REMOVED***

export default function JobItem(***REMOVED***
  company,
  job,
  tags,
  preview = false,
  className = "",
  onTagClick
***REMOVED***) ***REMOVED***
  const classes = useStyles(***REMOVED*** preview ***REMOVED***);

  return (
    <Box className=***REMOVED***clsx(classes.root, className)***REMOVED***>
      <Box className=***REMOVED***classes.logoWrapper***REMOVED*** pr=***REMOVED***[2, 3]***REMOVED***>
        ***REMOVED***!!company && (
          <CompanyLogo
            company=***REMOVED***company***REMOVED***
            onClick=***REMOVED***
              !preview ? () => Router.push(`/companies/$***REMOVED***company.id***REMOVED***`) : null
            ***REMOVED***
          />
        )***REMOVED***
      </Box>
      <Box display="flex" alignItems="center" flexWrap="wrap" flex=***REMOVED***1***REMOVED***>
        <Box mb=***REMOVED***1***REMOVED*** flex=***REMOVED***1***REMOVED*** flexBasis=***REMOVED***350***REMOVED***>
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
              ***REMOVED***preview ? (
                <Typography variant="subtitle2" component="span" gutterBottom>
                  ***REMOVED***company.name || "Company"***REMOVED***
                </Typography>
              ) : (
                <Link
                  href="/companies/[id]"
                  as=***REMOVED***`/companies/$***REMOVED***company.id***REMOVED***`***REMOVED***
                  passHref>
                  <MuiLink variant="subtitle2" color="inherit" gutterBottom>
                    ***REMOVED***company.name***REMOVED***
                  </MuiLink>
                </Link>
              )***REMOVED***
            </React.Fragment>
          )***REMOVED***
          ***REMOVED***(!preview || !!job.jobType) && (
            <Box display="flex" alignItems="center" pt="1rem" pb="0.5rem">
              ***REMOVED***!!job.jobType && (
                <Typography
                  className=***REMOVED***classes.extrasText***REMOVED***
                  color="textSecondary"
                  variant="body2">
                  <DescriptionIcon className=***REMOVED***classes.extrasIcon***REMOVED*** />***REMOVED***" "***REMOVED***
                  ***REMOVED***job.jobType***REMOVED***
                </Typography>
              )***REMOVED***
              ***REMOVED***!preview && (
                <Typography
                  className=***REMOVED***classes.extrasText***REMOVED***
                  color="textSecondary"
                  variant="body2">
                  <ScheduleIcon className=***REMOVED***classes.extrasIcon***REMOVED*** />
                  ***REMOVED***formatDistance(
                    job.created ? new Date(job.created) : new Date(),
                    new Date(),
                    ***REMOVED*** addSuffix: true ***REMOVED***
                  )***REMOVED***
                </Typography>
              )***REMOVED***
              ***REMOVED***
                <Typography
                className=***REMOVED***classes.extrasText***REMOVED***
                color="textSecondary"
                variant="body2">
                <VisibilityIcon className=***REMOVED***classes.extrasIcon***REMOVED*** />
                ***REMOVED***job.views ? job.views : 0***REMOVED*** ***REMOVED***`View$***REMOVED***job.views === 1 ? '' : 's'***REMOVED***`***REMOVED***
              </Typography>
              ***REMOVED***
              ***REMOVED***
                !preview && job.approvalStatus !== "Closed" && job.deadline && (
                  <ExpirationTag deadline=***REMOVED***new Date(job.deadline)***REMOVED*** />
                )
              ***REMOVED***
              ***REMOVED***
                !preview && job.approvalStatus === "Closed" && (
                  <ClosedTag />
                )
              ***REMOVED***
            </Box>
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
                onClick=***REMOVED***!!onTagClick ? () => onTagClick(tag.name) : null***REMOVED***
              />
            );
          ***REMOVED***)***REMOVED***
        </Box>
      </Box>
    </Box>
  );
***REMOVED***
