import {
  TableRow,
  TableCell,
  makeStyles,
  Link as MuiLink,
  Box,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import Link from "next/link";
import CompanyLogo from "./company-logo";
import JobApprovalStatus from "./job-approval-status";
import format from "date-fns/format";
import Router from "next/router";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import { Fragment } from "react";
import JobCloseDialog from "./job-close-dialog";
import HSSnackBar from "./hs-snackbar";
import api from "../api";
import useCloseJob from "../hooks/use-close-job";

const useStyles = makeStyles((theme) => ({
  tableHead: {
    fontWeight: 800,
  },
}));

export default function JobTableRow({ jobData }) {
  const classes = useStyles();
  const { job, company } = jobData;
  const closeJob = async () => {
    await api.closeJob(job.id);
    Router.replace("/dashboard/jobs");
  };
  const [
    { closeStatus, closeDialogOpen },
    setCloseDialogOpen,
    clearError,
    handleCloseJob,
  ] = useCloseJob(closeJob);
  return (
    <Fragment>
      <TableRow>
        <TableCell variant="head" classes={{ head: classes.tableHead }}>
          <Link
            href="/dashboard/jobs/[slug]"
            as={`/dashboard/jobs/${job.slug}`}
            passHref>
            <MuiLink color="inherit" variant="subtitle1">
              {job.position}
            </MuiLink>
          </Link>
        </TableCell>
        <TableCell>
          {company ? (
            <Box display="flex" alignItems="center">
              {company.logo && (
                <Box pr={1}>
                  <CompanyLogo
                    company={company}
                    abbrevFallback={false}
                    size="extraSmall"
                  />
                </Box>
              )}
              {company.name}
            </Box>
          ) : (
            "None"
          )}
        </TableCell>
        <TableCell>
          <JobApprovalStatus approvalStatus={job.approvalStatus} />
        </TableCell>
        <TableCell>{job.views}</TableCell>
        <TableCell align="left">
          {job.deadline ? format(new Date(job.deadline), "MMM dd, yyyy") : "--"}
        </TableCell>
        <TableCell align="left">
          <Tooltip title="Edit Job">
            <IconButton
              disabled={closeStatus === "closing" || closeStatus === "closed"}
              color="secondary"
              onClick={() => Router.push(`/dashboard/jobs/edit/${job.slug}`)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close Job">
            <IconButton
              disabled={closeStatus === "closing" || closeStatus === "closed"}
              color="secondary"
              onClick={() => setCloseDialogOpen(true)}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <JobCloseDialog
        open={closeDialogOpen}
        onClose={() => setCloseDialogOpen(false)}
        onConfirmation={handleCloseJob}
      />
      <HSSnackBar
        open={closeStatus === "errorClosing"}
        variant="error"
        message="Problem occurred closing job."
        autoHideDuration={3000}
        onClose={clearError}
      />
    </Fragment>
  );
}
