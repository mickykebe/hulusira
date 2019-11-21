import Router from "next/router";
import redirect from "../../../utils/redirect";
import api from "../../../api";
import DashboardLayout from "../../../components/dashboard-layout";
import { Container } from "@material-ui/core";
import CompanyForm from "../../../components/company-form";
import { useState } from "react";
import HSSnackBar from "../../../components/hs-snackbar";

export default function EditCompany({ user, company }) {
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const handleSubmit = async function(values, files) {
    let logo = values.logo;
    if (files.length > 0) {
      logo = await api.uploadImage(files[0]);
    }
    await api.updateCompany(company.id, {
      ...values,
      logo
    });
    setShowSuccessSnackbar(true);
  };
  return (
    <DashboardLayout user={user}>
      <Container maxWidth="md">
        <CompanyForm initialValues={company} onSubmit={handleSubmit} />
        <HSSnackBar
          open={showSuccessSnackbar}
          variant="success"
          autoHideDuration={3000}
          message="Company successfully updated"
          onClose={() => {
            setShowSuccessSnackbar(false);
          }}
        />
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
