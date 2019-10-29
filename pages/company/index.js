import {
  Container,
  Box,
  Button,
  Typography,
  IconButton,
  makeStyles
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import DashboardLayout from "../../components/dashboard-layout";
import Router from "next/router";
import api from "../../api";
import CompanyLogo from "../../components/company-logo";
import HSPaper from "../../components/hs-paper";

const useStyles = makeStyles(theme => ({
  companyItem: {
    marginBottom: theme.spacing(1)
  },
  actionButton: {
    padding: theme.spacing(1)
  }
}));

function Companies({ user, companies }) {
  const classes = useStyles();
  return (
    <DashboardLayout user={user} selectedItem="company">
      <Container maxWidth="md">
        <Box display="flex" pb={2}>
          <Box flex="1" />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => Router.push("/company/new")}>
            Add Company
          </Button>
        </Box>
        {companies.map(company => (
          <HSPaper className={classes.companyItem}>
            <Box p={2} key={company.id} display="flex" alignItems="center">
              <Box pr={[2, 3]}>
                <CompanyLogo company={company} />
              </Box>
              <Typography variant="subtitle1">{company.name}</Typography>
              <Box flex="1" />
              <IconButton className={classes.actionButton}>
                <EditIcon />
              </IconButton>
              <IconButton className={classes.actionButton}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </HSPaper>
        ))}
      </Container>
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
