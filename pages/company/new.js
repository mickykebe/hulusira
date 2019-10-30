import DashboardLayout from "../../components/dashboard-layout";
import redirect from "../../utils/redirect";
import Router from "next/router";
import { Container } from "@material-ui/core";
import api from "../../api";
import CompanyForm from "../../components/company-form";

export default function NewCompany({ user }) {
  const handleSubmit = async function(values, files) {
    let logo = null;
    if (files.length > 0) {
      logo = await api.uploadImage(files[0]);
    }
    await api.createCompany({
      ...values,
      logo
    });
    Router.push("/company");
  };
  return (
    <DashboardLayout user={user}>
      <Container maxWidth="md">
        <CompanyForm onSubmit={handleSubmit} />
      </Container>
    </DashboardLayout>
  );
}

NewCompany.getInitialProps = async function(ctx) {
  const { user } = ctx;

  if (!user) {
    redirect(ctx, "/");
  }

  return {};
};
