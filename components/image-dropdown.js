import useImageDropzone from "../hooks/use-image-dropzone";
import { makeStyles, Box, Typography, Button } from "@material-ui/core";
import FormImagePreview from "./form-image-preview";

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
  flex: {
    flex: 1
  }
}));

export default function ImageDropdown({ preview = "", files, onFilesChange }) {
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
      {files.length === 0 && preview && (
        <FormImagePreview src={preview} alt="Company logo preview" />
      )}
      {files.map(file => (
        <FormImagePreview
          key={file.name}
          src={file.preview}
          alt="Company logo preview"
        />
      ))}
    </Box>
  );
}
