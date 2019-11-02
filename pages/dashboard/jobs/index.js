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
  Link as MuiLink
***REMOVED*** from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import redirect from "../../../utils/redirect";
import api from "../../../api";
import JobItem from "../../../components/job-item";
import HSPaper from "../../../components/hs-paper";
import CompanyLogo from "../../../components/company-logo";
import Link from "next/link";

const useStyles = makeStyles(theme => (***REMOVED***
  tableHead: ***REMOVED***
    fontWeight: 800
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
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="secondary">
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              ***REMOVED***)***REMOVED***
            </TableBody>
          </Table>
        </HSPaper>
        ***REMOVED***/* ***REMOVED***jobs.map((***REMOVED*** job, company ***REMOVED***) => ***REMOVED***
          return (
            <Box mb=***REMOVED***2***REMOVED*** key=***REMOVED***job.id***REMOVED***>
              <JobItem job=***REMOVED***job***REMOVED*** tags=***REMOVED***job.tags***REMOVED*** company=***REMOVED***company***REMOVED*** />
            </Box>
          );
        ***REMOVED***)***REMOVED*** */***REMOVED***
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
