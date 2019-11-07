import DashboardLayout from "../../../components/dashboard-layout";
import redirect from "../../../utils/redirect";
import Router from "next/router";
import ***REMOVED*** Container ***REMOVED*** from "@material-ui/core";
import api from "../../../api";
import CompanyForm from "../../../components/company-form";

export default function NewCompany(***REMOVED*** user ***REMOVED***) ***REMOVED***
  const handleSubmit = async function(values, files) ***REMOVED***
    let logo = null;
    if (files.length > 0) ***REMOVED***
      logo = await api.uploadImage(files[0]);
    ***REMOVED***
    await api.createCompany(***REMOVED***
      ...values,
      logo
    ***REMOVED***);
    Router.push("/dashboard/companies");
  ***REMOVED***;
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED***>
      <Container maxWidth="md">
        <CompanyForm onSubmit=***REMOVED***handleSubmit***REMOVED*** />
      </Container>
    </DashboardLayout>
  );
***REMOVED***

NewCompany.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (!user) ***REMOVED***
    redirect(ctx, "/");
  ***REMOVED***

  return ***REMOVED******REMOVED***;
***REMOVED***;
