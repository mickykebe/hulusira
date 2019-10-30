import redirect from "../../utils/redirect";
import api from "../../api";
import DashboardLayout from "../../components/dashboard-layout";
import { Container } from "@material-ui/core";
import CompanyForm from "../../components/company-form";

export default function EditCompany({ user, company }) {
  return (
    <DashboardLayout user={user}>
      <Container maxWidth="md">
        <CompanyForm initialValues={company} />
      </Container>
    </DashboardLayout>
  );
}

EditCompany.getInitialProps = async function(ctx) {
  const { user } = ctx;

  if (!user) {
    redirect(ctx, "/");
  }

  const { companyId } = ctx.query;
  const company = await api.getCompany(ctx, companyId);

  return { company };
};
