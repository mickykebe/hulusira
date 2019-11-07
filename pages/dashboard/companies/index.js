import {
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
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import DashboardLayout from "../../../components/dashboard-layout";
import Router from "next/router";
import api from "../../../api";
import CompanyLogo from "../../../components/company-logo";
import HSPaper from "../../../components/hs-paper";
import { useReducer, useState } from "react";
import HSSnackBar from "../../../components/hs-snackbar";
import redirect from "../../../utils/redirect";
import EmptyList from "../../../components/empty-list";

const useStyles = makeStyles(theme => ({
  companyItem: {
    marginBottom: theme.spacing(1)
  }
}));

function deleteCompanyReducer(state, action) {
  switch (action.type) {
    case "DELETING_COMPANY":
      return { isDeletingCompany: true, errorDeletingCompany: false };
    case "DELETED_COMPANY":
      return { isDeletingCompany: false, errorDeletingCompany: false };
    case "ERROR_DELETING_COMPANY":
      return { isDeletingCompany: false, errorDeletingCompany: true };
    case "CLEAR_ERROR":
      return { ...state, errorDeletingCompany: false };
    default:
      throw new Error("Unidentified action type");
  }
}

function Companies({ user, companies }) {
  const classes = useStyles();
  const [{ isDeletingCompany, errorDeletingCompany }, dispatch] = useReducer(
    deleteCompanyReducer,
    { isDeletingCompany: false, errorDeletingCompany: false }
  );
  const [companyIdPendingDelete, setCompanyIdPendingDelete] = useState(null);
  const handleDeleteCompany = async () => {
    setCompanyIdPendingDelete(null);
    dispatch({ type: "DELETING_COMPANY" });
    try {
      await api.deleteCompany(companyIdPendingDelete);
      Router.push("/dashboard/companies");
      dispatch({ type: "DELETED_COMPANY" });
    } catch (err) {
      dispatch({ type: "ERROR_DELETING_COMPANY" });
    }
  };
  return (
    <DashboardLayout user={user} selectedItem="company">
      <Container maxWidth="md">
        <Box display="flex" py={2}>
          <Box flex="1" />
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => Router.push("/dashboard/companies/new")}>
            Add Company
          </Button>
        </Box>
        {companies.length === 0 && (
          <EmptyList message="No Companies Available" />
        )}
        {companies.map(company => (
          <HSPaper key={company.id} className={classes.companyItem}>
            <Box p={2} display="flex" alignItems="center">
              <Box pr={[2, 3]}>
                <CompanyLogo company={company} />
              </Box>
              <Typography variant="subtitle1">{company.name}</Typography>
              <Box flex="1" />
              <IconButton
                color="secondary"
                className={classes.actionButton}
                onClick={() =>
                  Router.push(`/dashboard/companies/${company.id}`)
                }>
                <EditIcon />
              </IconButton>
              <IconButton
                color="secondary"
                className={classes.actionButton}
                disabled={isDeletingCompany}
                onClick={() => setCompanyIdPendingDelete(company.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </HSPaper>
        ))}
      </Container>
      <Dialog
        open={companyIdPendingDelete !== null}
        onClose={() => setCompanyIdPendingDelete(null)}>
        <DialogTitle>Delete this company?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deleting this company will remove all jobs posted under it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCompanyIdPendingDelete(null)}
            color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteCompany} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <HSSnackBar
        open={errorDeletingCompany}
        variant="error"
        message="Problem occurred deleting company."
        autoHideDuration={3000}
        onClose={() => dispatch("CLEAR_ERROR")}
      />
    </DashboardLayout>
  );
}

Companies.getInitialProps = async function(ctx) {
  const { user } = ctx;

  if (!user) {
    redirect(ctx, "/");
  }

  let companies = [];
  try {
    companies = await api.getCompanies(ctx);
  } catch (err) {
    console.log(err);
  }

  return { companies };
};

export default Companies;
