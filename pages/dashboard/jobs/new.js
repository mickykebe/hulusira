import DashboardLayout from "../../../components/dashboard-layout";
import { Container } from "@material-ui/core";
import redirect from "../../../utils/redirect";

export default function DashboardNewJob({ user }) {
  return (
    <DashboardLayout user={user}>
      <Container maxWidth="md"></Container>
    </DashboardLayout>
  );
}

DashboardNewJob.getInitialProps = async function(ctx) {
  const { user } = ctx;

  if (!user) {
    redirect(ctx, "/new");
  }

  return {};
};
