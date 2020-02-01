import DashboardLayout from "../../../components/dashboard-layout";
import redirect from "../../../utils/redirect";
import Router from "next/router";
import { Container } from "@material-ui/core";
import api from "../../../api";
import CompanyForm from "../../../components/company-form";
import { useState } from "react";

export default function NewCompany({ user }) {
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const handleSubmit = async function(values, files) {
    let logo = null;
    if (files.length > 0) {
      logo = await api.uploadImage(files[0]);
    }
    await api.createCompany({
      ...values,
      logo
    });
    Router.push("/dashboard/companies");
    setDisableSaveButton(true);
  };
  return (
    <DashboardLayout user={user}>
      <Container maxWidth="md">
        <CompanyForm onSubmit={handleSubmit} disableSaveButton={disableSaveButton} />
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
