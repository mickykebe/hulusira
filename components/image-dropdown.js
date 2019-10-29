import useImageDropzone from "../hooks/use-image-dropzone";
import ***REMOVED*** makeStyles, Box, Typography, Button ***REMOVED*** from "@material-ui/core";

const useStyles = makeStyles(theme => (***REMOVED***
  uploader: ***REMOVED***
    border: `1px dashed $***REMOVED***theme.palette.grey[200]***REMOVED***`,
    display: "flex",
    padding: theme.spacing(4),
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  ***REMOVED***,
  uploaderThumbnail: ***REMOVED***
    width: 130
  ***REMOVED***,
  previewThumb: ***REMOVED***
    width: 150,
    height: 150,
    position: "relative",
    backgroundColor: "#fafbfc",
    margin: `$***REMOVED***theme.spacing(2)***REMOVED***px 0`,
    border: `1px solid #eee`
  ***REMOVED***,
  previewThumbImg: ***REMOVED***
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%"
  ***REMOVED***,
  flex: ***REMOVED***
    flex: 1
  ***REMOVED***
***REMOVED***));

export default function ImageDropdown(***REMOVED*** files, onFilesChange ***REMOVED***) ***REMOVED***
  const ***REMOVED*** getRootProps, getInputProps ***REMOVED*** = useImageDropzone(
    files,
    onFilesChange
  );
  const classes = useStyles();
  return (
    <Box pt=***REMOVED***2***REMOVED*** pb=***REMOVED***2***REMOVED***>
      <div ***REMOVED***...getRootProps(***REMOVED*** className: classes.uploader ***REMOVED***)***REMOVED***>
        <input ***REMOVED***...getInputProps()***REMOVED*** />
        <div>
          <img
            className=***REMOVED***classes.uploaderThumbnail***REMOVED***
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
      ***REMOVED***files.map(file => (
        <Box className=***REMOVED***classes.previewThumb***REMOVED*** key=***REMOVED***file.name***REMOVED***>
          <img
            className=***REMOVED***classes.previewThumbImg***REMOVED***
            src=***REMOVED***file.preview***REMOVED***
            alt="Company logo preview"
          />
        </Box>
      ))***REMOVED***
    </Box>
  );
***REMOVED***
