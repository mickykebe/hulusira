import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  logoContainer: props => ({
    position: "relative",
    backgroundColor: `#fafbfc`,
    border: `1px solid #eee`,
    ...(props.size === "small" && {
      width: 24,
      height: 24
    }),
    ...(props.size === "medium" && {
      width: 48,
      height: 48
    }),
    ...(props.size === "large" && {
      width: 64,
      height: 64
    })
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
  }
});

export default function CompanyLogo({ size = "medium", src }) {
  const classes = useStyles({ size });
  return (
    <Box className={classes.logoContainer}>
      <img
        className={classes.logo}
        src={src}
        alt="Company logo"
        loading="lazy"
      />
    </Box>
  );
}
