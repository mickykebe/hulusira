import DashboardLayout from "../components/dashboard-layout";
import redirect from "../utils/redirect";

function Dashboard({ user }) {
  return <DashboardLayout user={user} />;
}

Dashboard.getInitialProps = async function(ctx) {
  const { user } = ctx;

  if (!user) {
    redirect(ctx, "/");
  }

  return {};
};

export default Dashboard;
