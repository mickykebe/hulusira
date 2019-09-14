import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const logoSizes = {
  small: {
    width: 24,
    height: 24,
  },
  medium: {
    width: 48,
    height: 48,
  },
  large: {
    width: 64,
    height: 64,
  },
}

const useStyles = makeStyles({
  logoContainer: props => ({
    position: "relative",
    backgroundColor: `#fafbfc`,
    border: `1px solid #eee`,
    ...(logoSizes[props.size]),
  }),
  logo: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%"
  },
  abbrev: props => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...(logoSizes[props.size]),
  }),
});

function abbrev(name) {
  const [word1, word2, ..._rest] = name.split(" ");
  return `${word1[0] ? word1[0].toUpperCase() : ""}${word2 ? word2[0] : ""}`;
}

export default function CompanyLogo({ company, abbrevFallback = true, size = "medium" }) {
  const classes = useStyles({ size });
  if(company.logo) {
    return (
      <Box className={classes.logoContainer}>
        <img
          className={classes.logo}
          src={company.logo}
          alt="Company logo"
          loading="lazy"
        />
      </Box>
    );
  }
  if(abbrevFallback) {
    return (
      <Typography
        variant="h4"
        color="textSecondary"
        align="center"
        className={classes.abbrev}>
          {abbrev(company.name)}
        </Typography>
    );
  }
  return null;
}
