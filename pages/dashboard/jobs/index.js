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
  Typography
***REMOVED*** from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import redirect from "../../../utils/redirect";
import HSPaper from "../../../components/hs-paper";
import CompanyLogo from "../../../components/company-logo";
import Link from "next/link";
import api from "../../../api";

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
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED*** selectedItem="jobs">
      <Container maxWidth="md">
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
        ***REMOVED***jobs.length === 0 && (
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              className=***REMOVED***classes.noJobsImage***REMOVED***
              src="/static/nodata.svg"
              alt="No Jobs Available"
            />
            <Typography variant="h6">
              You haven't posted any jobs yet
            </Typography>
          </Box>
        )***REMOVED***
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
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                ***REMOVED***jobs.map((***REMOVED*** job, company ***REMOVED***) => ***REMOVED***
                  return (
                    <TableRow key=***REMOVED***job.id***REMOVED***>
                      <TableCell
                        variant="head"
                        classes=***REMOVED******REMOVED*** head: classes.tableHead ***REMOVED******REMOVED***>
                        <Link
                          href="/jobs/[slug]"
                          as=***REMOVED***`/jobs/$***REMOVED***job.slug***REMOVED***`***REMOVED***
                          passHref>
                          <MuiLink color="inherit">***REMOVED***job.position***REMOVED***</MuiLink>
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
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick=***REMOVED***() =>
                            Router.push(`/dashboard/jobs/edit/$***REMOVED***job.slug***REMOVED***`)
                          ***REMOVED***>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                ***REMOVED***)***REMOVED***
              </TableBody>
            </Table>
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

  return ***REMOVED*** jobs: [] ***REMOVED***;
***REMOVED***;
