import ***REMOVED***
  Container,
  Box,
  Button,
  Typography,
  IconButton,
  makeStyles
***REMOVED*** from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import DashboardLayout from "../../components/dashboard-layout";
import Router from "next/router";
import api from "../../api";
import CompanyLogo from "../../components/company-logo";
import HSPaper from "../../components/hs-paper";

const useStyles = makeStyles(theme => (***REMOVED***
  companyItem: ***REMOVED***
    marginBottom: theme.spacing(1)
  ***REMOVED***,
  actionButton: ***REMOVED***
    padding: theme.spacing(1)
  ***REMOVED***
***REMOVED***));

function Companies(***REMOVED*** user, companies ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <DashboardLayout user=***REMOVED***user***REMOVED*** selectedItem="company">
      <Container maxWidth="md">
        <Box display="flex" pb=***REMOVED***2***REMOVED***>
          <Box flex="1" />
          <Button
            variant="contained"
            color="primary"
            startIcon=***REMOVED***<AddIcon />***REMOVED***
            onClick=***REMOVED***() => Router.push("/company/new")***REMOVED***>
            Add Company
          </Button>
        </Box>
        ***REMOVED***companies.map(company => (
          <HSPaper className=***REMOVED***classes.companyItem***REMOVED***>
            <Box p=***REMOVED***2***REMOVED*** key=***REMOVED***company.id***REMOVED*** display="flex" alignItems="center">
              <Box pr=***REMOVED***[2, 3]***REMOVED***>
                <CompanyLogo company=***REMOVED***company***REMOVED*** />
              </Box>
              <Typography variant="subtitle1">***REMOVED***company.name***REMOVED***</Typography>
              <Box flex="1" />
              <IconButton className=***REMOVED***classes.actionButton***REMOVED***>
                <EditIcon />
              </IconButton>
              <IconButton className=***REMOVED***classes.actionButton***REMOVED***>
                <DeleteIcon />
              </IconButton>
            </Box>
          </HSPaper>
        ))***REMOVED***
      </Container>
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
