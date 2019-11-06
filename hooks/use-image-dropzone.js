import ***REMOVED*** useState, useEffect ***REMOVED*** from "react";
import ***REMOVED*** useDropzone ***REMOVED*** from "react-dropzone";

export default function useImageDropzone(files, setFiles) ***REMOVED***
  const ***REMOVED*** getRootProps, getInputProps ***REMOVED*** = useDropzone(***REMOVED***
    accept: "image/*",
    multiple: false,
    onDrop: acceptedFiles => ***REMOVED***
      setFiles(
        acceptedFiles.map(file => ***REMOVED***
          file.preview = URL.createObjectURL(file);
          return file;
        ***REMOVED***)
      );
    ***REMOVED***
  ***REMOVED***);

  useEffect(() => ***REMOVED***
    files.forEach(file => URL.revokeObjectURL(file.preview));
  ***REMOVED***, [files]);

  return ***REMOVED*** getRootProps, getInputProps ***REMOVED***;
***REMOVED***
