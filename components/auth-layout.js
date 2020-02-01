import { makeStyles } from "@material-ui/styles";
import Link from "next/link";
import { Link as MuiLink } from "@material-ui/core";
import HSPaper from "./hs-paper";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `0 ${theme.spacing(2)}px`
  },
  signinCard: {
    padding: theme.spacing(2),
    maxWidth: 400,
    margin: "auto"
  },
  logoLink: {
    display: "block"
  }
}));

export default function AuthLayout({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <HSPaper className={classes.signinCard}>
        <Link href="/" passHref>
          <MuiLink
            classes={{ root: classes.logoLink }}
            variant="h5"
            align="center"
            color="inherit"
            underline="none">
            HuluSira
          </MuiLink>
        </Link>
        {children}
      </HSPaper>
    </div>
  );
}
