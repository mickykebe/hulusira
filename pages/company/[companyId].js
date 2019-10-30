import redirect from "../../utils/redirect";
import api from "../../api";
import DashboardLayout from "../../components/dashboard-layout";
import ***REMOVED*** Container ***REMOVED*** from "@material-ui/core";
import CompanyForm from "../../components/company-form";

export default function EditCompany(***REMOVED*** user, company ***REMOVED***) ***REMOVED***
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED***>
      <Container maxWidth="md">
        <CompanyForm initialValues=***REMOVED***company***REMOVED*** />
      </Container>
    </DashboardLayout>
  );
***REMOVED***

EditCompany.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (!user) ***REMOVED***
    redirect(ctx, "/");
  ***REMOVED***

  const ***REMOVED*** companyId ***REMOVED*** = ctx.query;
  const company = await api.getCompany(ctx, companyId);

  return ***REMOVED*** company ***REMOVED***;
***REMOVED***;
