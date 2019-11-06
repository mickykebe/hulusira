import DashboardLayout from "../../../components/dashboard-layout";
import Router from "next/router";
import {
  Container,
  Button,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  makeStyles,
  Link as MuiLink,
  Tooltip
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import addDays from "date-fns/addDays";
import formatDistance from "date-fns/formatDistance";
import isAfter from "date-fns/isAfter";
import redirect from "../../../utils/redirect";
import HSPaper from "../../../components/hs-paper";
import CompanyLogo from "../../../components/company-logo";
import Link from "next/link";
import api from "../../../api";
import EmptyList from "../../../components/empty-list";
import JobApprovalStatus from "../../../components/job-approval-status";
import { useReducer, useState } from "react";
import jobCloseReducer from "../../../reducers/close-job";
import JobCloseDialog from "../../../components/job-close-dialog";
import HSSnackBar from "../../../components/hs-snackbar";

const useStyles = makeStyles(theme => ({
  tableHead: {
    fontWeight: 800
  },
  noJobsImage: {
    width: "20rem",
    height: "20rem"
  }
}));

export default function DashboardJobs({ user, jobs }) {
  const classes = useStyles();
  const [{ isClosingJob, errorClosingJob }, dispatch] = useReducer(
    jobCloseReducer,
    { isClosingJob: false, errorClosingJob: false }
  );
  const [jobPendingClose, setJobPendingClose] = useState(null);
  const handleCloseJob = async jobId => {
    dispatch({ type: "CLOSING_JOB" });
    try {
      await api.closeJob(jobId);
      Router.replace("/dashboard/jobs");
      dispatch({ type: "CLOSED_JOB" });
    } catch (err) {
      dispatch({ type: "ERROR_CLOSING_JOB" });
    }
    setJobPendingClose(null);
  };

  return (
    <DashboardLayout user={user} selectedItem="jobs">
      <Container maxWidth="md">
        <Box display="flex" py={2}>
          <Box flex="1" />
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => Router.push("/dashboard/jobs/new")}>
            Post Job
          </Button>
        </Box>
        {jobs.length === 0 && <EmptyList message="No Jobs Available" />}
        {jobs.length > 0 && (
          <HSPaper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell classes={{ head: classes.tableHead }}>
                    Position
                  </TableCell>
                  <TableCell classes={{ head: classes.tableHead }}>
                    Company
                  </TableCell>
                  <TableCell classes={{ head: classes.tableHead }}>
                    Status
                  </TableCell>
                  <TableCell classes={{ head: classes.tableHead }}>
                    Expires in
                  </TableCell>
                  <TableCell classes={{ head: classes.tableHead }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map(({ job, company }) => {
                  const expirationDate = addDays(new Date(job.created), 30);
                  return (
                    <TableRow key={job.id}>
                      <TableCell
                        variant="head"
                        classes={{ head: classes.tableHead }}>
                        <Link
                          href="/jobs/[slug]"
                          as={`/jobs/${job.slug}`}
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
                                  size="small"
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
                        <JobApprovalStatus
                          approvalStatus={job.approvalStatus}
                        />
                      </TableCell>
                      <TableCell>
                        {isAfter(new Date(), expirationDate)
                          ? "Expired"
                          : formatDistance(
                              addDays(new Date(job.created), 30),
                              new Date()
                            )}
                      </TableCell>
                      <TableCell align="left">
                        <Tooltip title="Edit Job">
                          <IconButton
                            color="secondary"
                            onClick={() =>
                              Router.push(`/dashboard/jobs/edit/${job.slug}`)
                            }>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Close Job">
                          <IconButton
                            disabled={isClosingJob}
                            color="secondary"
                            onClick={() => setJobPendingClose(job.id)}>
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <JobCloseDialog
              open={!!jobPendingClose}
              onClose={() => setJobPendingClose(null)}
              onConfirmation={() => handleCloseJob(jobPendingClose)}
            />
            <HSSnackBar
              open={errorClosingJob}
              variant="error"
              message="Problem occurred closing job."
              autoHideDuration={3000}
              onClose={() => dispatch({ type: "CLEAR_ERROR" })}
            />
          </HSPaper>
        )}
      </Container>
    </DashboardLayout>
  );
}

DashboardJobs.getInitialProps = async function(ctx) {
  const { user } = ctx;

  if (!user) {
    redirect(ctx, "/");
  }

  const jobs = await api.getMyJobs(ctx);

  return { jobs };
};
