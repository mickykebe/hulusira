import Router from "next/router";
import redirect from "../../../utils/redirect";
import api from "../../../api";
import DashboardLayout from "../../../components/dashboard-layout";
import ***REMOVED*** Container ***REMOVED*** from "@material-ui/core";
import CompanyForm from "../../../components/company-form";
import ***REMOVED*** useState ***REMOVED*** from "react";
import HSSnackBar from "../../../components/hs-snackbar";

export default function EditCompany(***REMOVED*** user, company ***REMOVED***) ***REMOVED***
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const handleSubmit = async function(values, files) ***REMOVED***
    let logo = values.logo;
    if (files.length > 0) ***REMOVED***
      logo = await api.uploadImage(files[0]);
    ***REMOVED***
    await api.updateCompany(company.id, ***REMOVED***
      ...values,
      logo
    ***REMOVED***);
    setShowSuccessSnackbar(true);
  ***REMOVED***;
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED***>
      <Container maxWidth="md">
        <CompanyForm initialValues=***REMOVED***company***REMOVED*** onSubmit=***REMOVED***handleSubmit***REMOVED*** />
        <HSSnackBar
          open=***REMOVED***showSuccessSnackbar***REMOVED***
          variant="success"
          autoHideDuration=***REMOVED***3000***REMOVED***
          message="Company successfully updated"
          onClose=***REMOVED***() => ***REMOVED***
            setShowSuccessSnackbar(false);
          ***REMOVED******REMOVED***
        />
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
