import ***REMOVED***
  TableRow,
  TableCell,
  makeStyles,
  Link as MuiLink,
  Box,
  Tooltip,
  IconButton
***REMOVED*** from "@material-ui/core";
import Link from "next/link";
import CompanyLogo from "./company-logo";
import JobApprovalStatus from "./job-approval-status";
import format from "date-fns/format";
import Router from "next/router";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import ***REMOVED*** Fragment ***REMOVED*** from "react";
import JobCloseDialog from "./job-close-dialog";
import HSSnackBar from "./hs-snackbar";
import api from "../api";
import useCloseJob from "../hooks/use-close-job";

const useStyles = makeStyles(theme => (***REMOVED***
  tableHead: ***REMOVED***
    fontWeight: 800
  ***REMOVED***
***REMOVED***));

export default function JobTableRow(***REMOVED*** jobData ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  const ***REMOVED*** job, company ***REMOVED*** = jobData;
  const closeJob = async () => ***REMOVED***
    await api.closeJob(job.id);
    Router.replace("/dashboard/jobs");
  ***REMOVED***;
  const [
    ***REMOVED*** closeStatus, closeDialogOpen ***REMOVED***,
    setCloseDialogOpen,
    clearError,
    handleCloseJob
  ] = useCloseJob(closeJob);
  return (
    <Fragment>
      <TableRow>
        <TableCell variant="head" classes=***REMOVED******REMOVED*** head: classes.tableHead ***REMOVED******REMOVED***>
          <Link
            href="/dashboard/jobs/[slug]"
            as=***REMOVED***`/dashboard/jobs/$***REMOVED***job.slug***REMOVED***`***REMOVED***
            passHref
          >
            <MuiLink color="inherit" variant="subtitle1">
              ***REMOVED***job.position***REMOVED***
            </MuiLink>
          </Link>
        </TableCell>
        <TableCell>
          ***REMOVED***company ? (
            <Box display="flex" alignItems="center">
              ***REMOVED***company.logo && (
                <Box pr=***REMOVED***1***REMOVED***>
                  <CompanyLogo
                    company=***REMOVED***company***REMOVED***
                    abbrevFallback=***REMOVED***false***REMOVED***
                    size="extraSmall"
                  />
                </Box>
              )***REMOVED***
              ***REMOVED***company.name***REMOVED***
            </Box>
          ) : (
            "None"
          )***REMOVED***
        </TableCell>
        <TableCell>
          <JobApprovalStatus approvalStatus=***REMOVED***job.approvalStatus***REMOVED*** />
        </TableCell>
        <TableCell align="left">
          ***REMOVED***job.deadline ? format(new Date(job.deadline), "MMM dd, yyyy") : "--"***REMOVED***
        </TableCell>
        <TableCell align="left">
          <Tooltip title="Edit Job">
            <IconButton
              disabled=***REMOVED***closeStatus === "closing" || closeStatus === "closed"***REMOVED***
              color="secondary"
              onClick=***REMOVED***() => Router.push(`/dashboard/jobs/edit/$***REMOVED***job.slug***REMOVED***`)***REMOVED***
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close Job">
            <IconButton
              disabled=***REMOVED***closeStatus === "closing" || closeStatus === "closed"***REMOVED***
              color="secondary"
              onClick=***REMOVED***() => setCloseDialogOpen(true)***REMOVED***
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <JobCloseDialog
        open=***REMOVED***closeDialogOpen***REMOVED***
        onClose=***REMOVED***() => setCloseDialogOpen(false)***REMOVED***
        onConfirmation=***REMOVED***handleCloseJob***REMOVED***
      />
      <HSSnackBar
        open=***REMOVED***closeStatus === "errorClosing"***REMOVED***
        variant="error"
        message="Problem occurred closing job."
        autoHideDuration=***REMOVED***3000***REMOVED***
        onClose=***REMOVED***clearError***REMOVED***
      />
    </Fragment>
  );
***REMOVED***
