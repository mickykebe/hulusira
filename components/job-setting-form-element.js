import HSCard from "./hs-card";
import ***REMOVED***
  FormControl,
  RadioGroup,
  makeStyles,
  Box,
  Typography,
  FormControlLabel,
  Radio
***REMOVED*** from "@material-ui/core";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import BusinessIcon from "@material-ui/icons/Business";

const useStyles = makeStyles(theme => (***REMOVED***
  radioGroup: ***REMOVED***
    justifyContent: "center"
  ***REMOVED***,
  hasCompanyIcon: ***REMOVED***
    marginRight: theme.spacing(1),
    width: "2rem",
    height: "2rem"
  ***REMOVED***,
  hasCompanyLabel: ***REMOVED***
    paddingTop: theme.spacing(0.5),
    fontWeight: 800,
    fontSize: "1.2rem"
  ***REMOVED***
***REMOVED***));

function HasCompanyLabel(***REMOVED*** label, Icon ***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <Box display="flex" alignItems="center">
      <Icon className=***REMOVED***classes.hasCompanyIcon***REMOVED*** />
      <Typography
        variant="body2"
        component="span"
        className=***REMOVED***classes.hasCompanyLabel***REMOVED***>
        ***REMOVED***label***REMOVED***
      </Typography>
    </Box>
  );
***REMOVED***

export default function JobSettingFormElement(***REMOVED***
  className,
  values,
  setFieldValue
***REMOVED***) ***REMOVED***
  const classes = useStyles();
  return (
    <HSCard className=***REMOVED***className***REMOVED*** title="Job Setting">
      <FormControl margin="normal" fullWidth component="fieldset">
        <RadioGroup
          className=***REMOVED***classes.radioGroup***REMOVED***
          name="hasCompany"
          value=***REMOVED***values.hasCompany***REMOVED***
          onChange=***REMOVED***ev =>
            setFieldValue("hasCompany", ev.target.value === "true")
          ***REMOVED***
          row>
          <FormControlLabel
            value=***REMOVED***true***REMOVED***
            control=***REMOVED***<Radio color="primary" />***REMOVED***
            label=***REMOVED***<HasCompanyLabel label="Company Job" Icon=***REMOVED***BusinessIcon***REMOVED*** />***REMOVED***
            labelPlacement="end"
          />
          <FormControlLabel
            value=***REMOVED***false***REMOVED***
            control=***REMOVED***<Radio color="primary" />***REMOVED***
            label=***REMOVED***
              <HasCompanyLabel
                label="Freelance Job"
                Icon=***REMOVED***AccessibilityNewIcon***REMOVED***
              />
            ***REMOVED***
            labelPlacement="end"
          />
        </RadioGroup>
      </FormControl>
    </HSCard>
  );
***REMOVED***
