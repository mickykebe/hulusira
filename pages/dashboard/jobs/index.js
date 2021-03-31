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
  makeStyles,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import redirect from "../../../utils/redirect";
import HSPaper from "../../../components/hs-paper";
import api from "../../../api";
import EmptyList from "../../../components/empty-list";
import JobTableRow from "../../../components/job-table-row";

const useStyles = makeStyles((theme) => ({
  tableHead: {
    fontWeight: 800,
  },
}));

export default function DashboardJobs({ user, jobs }) {
  const classes = useStyles();
  return (
    <DashboardLayout user={user} selectedItem="jobs">
      <Container maxWidth="lg">
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
                    Views
                  </TableCell>
                  <TableCell classes={{ head: classes.tableHead }}>
                    Deadline
                  </TableCell>
                  <TableCell classes={{ head: classes.tableHead }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((jobData) => {
                  return <JobTableRow key={jobData.job.id} jobData={jobData} />;
                })}
              </TableBody>
            </Table>
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
