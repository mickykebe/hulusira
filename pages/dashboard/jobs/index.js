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
  makeStyles
***REMOVED*** from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import redirect from "../../../utils/redirect";
import HSPaper from "../../../components/hs-paper";
import api from "../../../api";
import EmptyList from "../../../components/empty-list";
import JobTableRow from "../../../components/job-table-row";

const useStyles = makeStyles(theme => (***REMOVED***
  tableHead: ***REMOVED***
    fontWeight: 800
  ***REMOVED***
***REMOVED***));

export default function DashboardJobs(***REMOVED*** user, jobs ***REMOVED***) ***REMOVED***
  const classes = useStyles();
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
            onClick=***REMOVED***() => Router.push("/dashboard/jobs/new")***REMOVED***
          >
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
                ***REMOVED***jobs.map(jobData => ***REMOVED***
                  return <JobTableRow key=***REMOVED***jobData.job.id***REMOVED*** jobData=***REMOVED***jobData***REMOVED*** />;
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

  return ***REMOVED*** jobs ***REMOVED***;
***REMOVED***;
