import { Box, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  previewThumb: {
    width: 150,
    height: 150,
    position: "relative",
    backgroundColor: "#fafbfc",
    margin: `${theme.spacing(2)}px 0`,
    border: `1px solid #eee`
  },
  previewThumbImg: {
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
}));

export default function FormImagePreview({ src, alt = "" }) {
  const classes = useStyles();
  return (
    <Box className={classes.previewThumb}>
      <img className={classes.previewThumbImg} src={src} alt={alt} />
    </Box>
  );
}
