import HSCard from "./hs-card";
import {
  FormControl,
  RadioGroup,
  makeStyles,
  Box,
  Typography,
  FormControlLabel,
  Radio
} from "@material-ui/core";
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew";
import BusinessIcon from "@material-ui/icons/Business";

const useStyles = makeStyles(theme => ({
  radioGroup: {
    justifyContent: "center"
  },
  hasCompanyIcon: {
    marginRight: theme.spacing(1),
    width: "2rem",
    height: "2rem"
  },
  hasCompanyLabel: {
    paddingTop: theme.spacing(0.5),
    fontWeight: 800,
    fontSize: "1.2rem"
  }
}));

function HasCompanyLabel({ label, Icon }) {
  const classes = useStyles();
  return (
    <Box display="flex" alignItems="center">
      <Icon className={classes.hasCompanyIcon} />
      <Typography
        variant="body2"
        component="span"
        className={classes.hasCompanyLabel}>
        {label}
      </Typography>
    </Box>
  );
}

export default function JobSettingFormElement({
  className,
  values,
  setFieldValue
}) {
  const classes = useStyles();
  return (
    <HSCard className={className} title="Job Setting">
      <FormControl margin="normal" fullWidth component="fieldset">
        <RadioGroup
          className={classes.radioGroup}
          name="hasCompany"
          value={values.hasCompany}
          onChange={ev =>
            setFieldValue("hasCompany", ev.target.value === "true")
          }
          row>
          <FormControlLabel
            value={true}
            control={<Radio color="primary" />}
            label={<HasCompanyLabel label="Company Job" Icon={BusinessIcon} />}
            labelPlacement="end"
          />
          <FormControlLabel
            value={false}
            control={<Radio color="primary" />}
            label={
              <HasCompanyLabel
                label="Freelance Job"
                Icon={AccessibilityNewIcon}
              />
            }
            labelPlacement="end"
          />
        </RadioGroup>
      </FormControl>
    </HSCard>
  );
}
