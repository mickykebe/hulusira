import DashboardLayout from "../../../components/dashboard-layout";
import { Container } from "@material-ui/core";
import redirect from "../../../utils/redirect";

export default function DashboardJobs({ user, jobs }) {
  return (
    <DashboardLayout user={user} selectedItem="jobs">
      <Container maxWidth="md"></Container>
    </DashboardLayout>
  );
}

DashboardJobs.getInitialProps = async function(ctx) {
  const { user } = ctx;

  if (!user) {
    redirect(ctx, "/");
  }

  return {};
};
