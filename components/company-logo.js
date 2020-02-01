import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const logoSizes = {
  extraSmall: {
    width: "2rem",
    height: "2rem"
  },
  small: {
    width: "3rem",
    height: "3rem"
  },
  medium: {
    width: "4.5rem",
    height: "4.5rem"
  },
  large: {
    width: "6rem",
    height: "6rem"
  }
};

const useStyles = makeStyles(theme => ({
  logoContainer: props => ({
    position: "relative",
    backgroundColor: theme.palette.background.default,
    border: `1px solid #eee`,
    cursor: props.isLink ? "pointer" : "auto",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ...logoSizes[props.size]
  }),
  logo: {
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: "50%"
  },
  abbrev: props => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: props.isLink ? "pointer" : "auto",
    ...logoSizes[props.size]
  })
}));

function abbrev(name) {
  const [word1, word2, ..._rest] = name.split(" ");
  return `${word1[0] ? word1[0].toUpperCase() : ""}${word2 ? word2[0] : ""}`;
}

export default function CompanyLogo({
  company,
  abbrevFallback = true,
  size = "medium",
  onClick
}) {
  const classes = useStyles({ size, isLink: !!onClick });
  if (company.logo) {
    return (
      <Box className={classes.logoContainer} onClick={onClick}>
        <img
          className={classes.logo}
          src={company.logo}
          alt="Company logo"
          loading="lazy"
        />
      </Box>
    );
  }
  if (abbrevFallback) {
    return (
      <Box className={classes.logoContainer} onClick={onClick}>
        <Typography
          variant={size === "small" ? "h5" : "h4"}
          color="textSecondary"
          align="center"
          className={classes.abbrev}
          onClick={onClick}
        >
          {abbrev(company.name)}
        </Typography>
      </Box>
    );
  }
  return null;
}
