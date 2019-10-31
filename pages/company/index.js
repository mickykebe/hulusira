import ***REMOVED***
  Container,
  Box,
  Button,
  Typography,
  IconButton,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Toolbar
***REMOVED*** from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import DashboardLayout from "../../components/dashboard-layout";
import Router from "next/router";
import api from "../../api";
import CompanyLogo from "../../components/company-logo";
import HSPaper from "../../components/hs-paper";
import ***REMOVED*** useReducer, useState ***REMOVED*** from "react";
import HSSnackBar from "../../components/hs-snackbar";
import redirect from "../../utils/redirect";

const useStyles = makeStyles(theme => (***REMOVED***
  companyItem: ***REMOVED***
    marginBottom: theme.spacing(1)
  ***REMOVED***,
  actionButton: ***REMOVED***
    padding: theme.spacing(1)
  ***REMOVED***
***REMOVED***));

function deleteCompanyReducer(state, action) ***REMOVED***
  switch (action.type) ***REMOVED***
    case "DELETING_COMPANY":
      return ***REMOVED*** isDeletingCompany: true, errorDeletingCompany: false ***REMOVED***;
    case "DELETED_COMPANY":
      return ***REMOVED*** isDeletingCompany: false, errorDeletingCompany: false ***REMOVED***;
    case "ERROR_DELETING_COMPANY":
      return ***REMOVED*** isDeletingCompany: false, errorDeletingCompany: true ***REMOVED***;
    case "CLEAR_ERROR":
      return ***REMOVED*** ...state, errorDeletingCompany: false ***REMOVED***;
    default:
      throw new Error("Unidentified action type");
  ***REMOVED***
***REMOVED***

function Companies(***REMOVED*** user, companies ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  const [***REMOVED*** isDeletingCompany, errorDeletingCompany ***REMOVED***, dispatch] = useReducer(
    deleteCompanyReducer,
    ***REMOVED*** isDeletingCompany: false, errorDeletingCompany: false ***REMOVED***
  );
  const [companyIdPendingDelete, setCompanyIdPendingDelete] = useState(null);
  const handleDeleteCompany = async () => ***REMOVED***
    setCompanyIdPendingDelete(null);
    dispatch(***REMOVED*** type: "DELETING_COMPANY" ***REMOVED***);
    try ***REMOVED***
      await api.deleteCompany(companyIdPendingDelete);
      Router.push("/company");
      dispatch(***REMOVED*** type: "DELETED_COMPANY" ***REMOVED***);
    ***REMOVED*** catch (err) ***REMOVED***
      dispatch(***REMOVED*** type: "ERROR_DELETING_COMPANY" ***REMOVED***);
    ***REMOVED***
  ***REMOVED***;
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED*** selectedItem="company">
      <Container maxWidth="md">
        <Box display="flex" py=***REMOVED***2***REMOVED***>
          <Box flex="1" />
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon=***REMOVED***<AddIcon />***REMOVED***
            onClick=***REMOVED***() => Router.push("/company/new")***REMOVED***>
            Add Company
          </Button>
        </Box>
        ***REMOVED***companies.map(company => (
          <HSPaper key=***REMOVED***company.id***REMOVED*** className=***REMOVED***classes.companyItem***REMOVED***>
            <Box p=***REMOVED***2***REMOVED*** display="flex" alignItems="center">
              <Box pr=***REMOVED***[2, 3]***REMOVED***>
                <CompanyLogo company=***REMOVED***company***REMOVED*** />
              </Box>
              <Typography variant="subtitle1">***REMOVED***company.name***REMOVED***</Typography>
              <Box flex="1" />
              <IconButton
                className=***REMOVED***classes.actionButton***REMOVED***
                onClick=***REMOVED***() => Router.push(`/company/$***REMOVED***company.id***REMOVED***`)***REMOVED***>
                <EditIcon />
              </IconButton>
              <IconButton
                className=***REMOVED***classes.actionButton***REMOVED***
                disabled=***REMOVED***isDeletingCompany***REMOVED***
                onClick=***REMOVED***() => setCompanyIdPendingDelete(company.id)***REMOVED***>
                <DeleteIcon />
              </IconButton>
            </Box>
          </HSPaper>
        ))***REMOVED***
      </Container>
      <Dialog
        open=***REMOVED***companyIdPendingDelete !== null***REMOVED***
        onClose=***REMOVED***() => setCompanyIdPendingDelete(null)***REMOVED***>
        <DialogTitle>Delete this company?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deleting this company will dissociate it from all jobs created under
            it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick=***REMOVED***() => setCompanyIdPendingDelete(null)***REMOVED***
            color="primary">
            Cancel
          </Button>
          <Button onClick=***REMOVED***handleDeleteCompany***REMOVED*** color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <HSSnackBar
        open=***REMOVED***errorDeletingCompany***REMOVED***
        variant="error"
        message="Problem occurred deleting company."
        autoHideDuration=***REMOVED***3000***REMOVED***
        onClose=***REMOVED***() => dispatch("CLEAR_ERROR")***REMOVED***
      />
    </DashboardLayout>
  );
***REMOVED***

Companies.getInitialProps = async function(ctx) ***REMOVED***
  const ***REMOVED*** user ***REMOVED*** = ctx;

  if (!user) ***REMOVED***
    redirect(ctx, "/");
  ***REMOVED***

  let companies = [];
  try ***REMOVED***
    companies = await api.getCompanies(ctx);
  ***REMOVED*** catch (err) ***REMOVED***
    console.log(err);
  ***REMOVED***

  return ***REMOVED*** companies ***REMOVED***;
***REMOVED***;

export default Companies;
