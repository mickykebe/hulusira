import ***REMOVED***
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
***REMOVED*** from "@material-ui/core";

export default function JobCloseDialog(***REMOVED*** open, onClose, onConfirmation ***REMOVED***) ***REMOVED***
  return (
    <Dialog open=***REMOVED***open***REMOVED*** onClose=***REMOVED***onClose***REMOVED***>
      <DialogTitle>Close this job?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Closing a job renders it publicly inaccessible from the site.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick=***REMOVED***onClose***REMOVED*** color="primary">
          Cancel
        </Button>
        <Button onClick=***REMOVED***onConfirmation***REMOVED*** color="primary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
***REMOVED***
