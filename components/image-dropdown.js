import useImageDropzone from "../hooks/use-image-dropzone";
import { makeStyles, Box, Typography, Button } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  uploader: {
    border: `1px dashed ${theme.palette.grey[200]}`,
    display: "flex",
    padding: theme.spacing(4),
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  },
  uploaderThumbnail: {
    width: 130
  },
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
  },
  flex: {
    flex: 1
  }
}));

export default function ImageDropdown({ files, onFilesChange }) {
  const { getRootProps, getInputProps } = useImageDropzone(
    files,
    onFilesChange
  );
  const classes = useStyles();
  return (
    <Box pt={2} pb={2}>
      <div {...getRootProps({ className: classes.uploader })}>
        <input {...getInputProps()} />
        <div>
          <img
            className={classes.uploaderThumbnail}
            src="/static/photo.png"
            alt="Uploader thumbnail"
          />
        </div>
        <div>
          <Typography align="center" variant="h6">
            Company Logo
          </Typography>
          <Typography align="center" variant="body1">
            Drag 'n' drop or click to upload company logo
          </Typography>
        </div>
      </div>
      {files.map(file => (
        <Box className={classes.previewThumb} key={file.name}>
          <img
            className={classes.previewThumbImg}
            src={file.preview}
            alt="Company logo preview"
          />
        </Box>
      ))}
    </Box>
  );
}
