import DashboardLayout from "../../../components/dashboard-layout";
import Router from "next/router";
import ***REMOVED***
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
***REMOVED*** from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import addDays from "date-fns/addDays";
import format from 'date-fns/format';
import redirect from "../../../utils/redirect";
import HSPaper from "../../../components/hs-paper";
import CompanyLogo from "../../../components/company-logo";
import Link from "next/link";
import api from "../../../api";
import EmptyList from "../../../components/empty-list";
import JobApprovalStatus from "../../../components/job-approval-status";
import ***REMOVED*** useReducer, useState ***REMOVED*** from "react";
import jobCloseReducer from "../../../reducers/close-job";
import JobCloseDialog from "../../../components/job-close-dialog";
import HSSnackBar from "../../../components/hs-snackbar";

const useStyles = makeStyles(theme => (***REMOVED***
  tableHead: ***REMOVED***
    fontWeight: 800
  ***REMOVED***,
  noJobsImage: ***REMOVED***
    width: "20rem",
    height: "20rem"
  ***REMOVED***
***REMOVED***));

export default function DashboardJobs(***REMOVED*** user, jobs ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  const [***REMOVED*** isClosingJob, errorClosingJob ***REMOVED***, dispatch] = useReducer(
    jobCloseReducer,
    ***REMOVED*** isClosingJob: false, errorClosingJob: false ***REMOVED***
  );
  const [jobPendingClose, setJobPendingClose] = useState(null);
  const handleCloseJob = async jobId => ***REMOVED***
    setJobPendingClose(null);
    dispatch(***REMOVED*** type: "CLOSING_JOB" ***REMOVED***);
    try ***REMOVED***
      await api.closeJob(jobId);
      Router.replace("/dashboard/jobs");
      dispatch(***REMOVED*** type: "CLOSED_JOB" ***REMOVED***);
    ***REMOVED*** catch (err) ***REMOVED***
      dispatch(***REMOVED*** type: "ERROR_CLOSING_JOB" ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;

  return (
    <DashboardLayout user=***REMOVED***user***REMOVED*** selectedItem="jobs">
      <Container maxWidth="lg">
        <Box display="flex" py=***REMOVED***2***REMOVED***>
          <Box flex="1" />
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon=***REMOVED***<AddIcon />***REMOVED***
            onClick=***REMOVED***() => Router.push("/dashboard/jobs/new")***REMOVED***>
            Post Job
          </Button>
        </Box>
        ***REMOVED***jobs.length === 0 && <EmptyList message="No Jobs Available" />***REMOVED***
        ***REMOVED***jobs.length > 0 && (
          <HSPaper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell classes=***REMOVED******REMOVED*** head: classes.tableHead ***REMOVED******REMOVED***>
                    Position
                  </TableCell>
                  <TableCell classes=***REMOVED******REMOVED*** head: classes.tableHead ***REMOVED******REMOVED***>
                    Company
                  </TableCell>
                  <TableCell classes=***REMOVED******REMOVED*** head: classes.tableHead ***REMOVED******REMOVED***>
                    Status
                  </TableCell>
                  <TableCell classes=***REMOVED******REMOVED*** head: classes.tableHead ***REMOVED******REMOVED***>
                    Deadline
                  </TableCell>
                  <TableCell classes=***REMOVED******REMOVED*** head: classes.tableHead ***REMOVED******REMOVED***>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                ***REMOVED***jobs.map((***REMOVED*** job, company ***REMOVED***) => ***REMOVED***
                  //const expirationDate = addDays(new Date(job.created), 30);
                  return (
                    <TableRow key=***REMOVED***job.id***REMOVED***>
                      <TableCell
                        variant="head"
                        classes=***REMOVED******REMOVED*** head: classes.tableHead ***REMOVED******REMOVED***>
                        <Link
                          href="/dashboard/jobs/[slug]"
                          as=***REMOVED***`/dashboard/jobs/$***REMOVED***job.slug***REMOVED***`***REMOVED***
                          passHref>
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
                                  size="small"
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
                        <JobApprovalStatus
                          approvalStatus=***REMOVED***job.approvalStatus***REMOVED***
                        />
                      </TableCell>
                      <TableCell align="left">
                        ***REMOVED***job.deadline ? format(new Date(job.deadline), "MMM dd, yyyy") : "--"***REMOVED***
                      </TableCell>
                      ***REMOVED***/* <TableCell>
                        ***REMOVED***
                          job.approvalStatus === "Declined" ? "---" : (
                            isAfter(new Date(), expirationDate)
                          ? "Expired"
                          : formatDistance(
                              addDays(new Date(job.created), 30),
                              new Date()
                            )
                          )
                        ***REMOVED***
                      </TableCell> */***REMOVED***
                      <TableCell align="left">
                        <Tooltip title="Edit Job">
                          <IconButton
                            color="secondary"
                            onClick=***REMOVED***() =>
                              Router.push(`/dashboard/jobs/edit/$***REMOVED***job.slug***REMOVED***`)
                            ***REMOVED***>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Close Job">
                          <IconButton
                            disabled=***REMOVED***isClosingJob***REMOVED***
                            color="secondary"
                            onClick=***REMOVED***() => setJobPendingClose(job.id)***REMOVED***>
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                ***REMOVED***)***REMOVED***
              </TableBody>
            </Table>
            <JobCloseDialog
              open=***REMOVED***!!jobPendingClose***REMOVED***
              onClose=***REMOVED***() => setJobPendingClose(null)***REMOVED***
              onConfirmation=***REMOVED***() => handleCloseJob(jobPendingClose)***REMOVED***
            />
            <HSSnackBar
              open=***REMOVED***errorClosingJob***REMOVED***
              variant="error"
              message="Problem occurred closing job."
              autoHideDuration=***REMOVED***3000***REMOVED***
              onClose=***REMOVED***() => dispatch(***REMOVED*** type: "CLEAR_ERROR" ***REMOVED***)***REMOVED***
            />
          </HSPaper>
        )***REMOVED***
      </Container>
    </DashboardLayout>
  );
***REMOVED***

DashboardJobs.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (!user) ***REMOVED***
    redirect(ctx, "/");
  ***REMOVED***

  const jobs = await api.getMyJobs(ctx);

  return ***REMOVED*** jobs ***REMOVED***;
***REMOVED***;
