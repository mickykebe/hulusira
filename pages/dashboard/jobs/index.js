import DashboardLayout from "../../../components/dashboard-layout";
import Router from "next/router";
import { Container, Button, Box } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import redirect from "../../../utils/redirect";
import api from "../../../api";
import JobItem from "../../../components/job-item";

export default function DashboardJobs({ user, jobs }) {
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
        {jobs.map(({ job, company }) => {
          return (
            <Box mb={2} key={job.id}>
              <JobItem job={job} tags={job.tags} company={company} />
            </Box>
          );
        })}
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
