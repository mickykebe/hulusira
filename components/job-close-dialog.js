import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@material-ui/core";

export default function JobCloseDialog({ open, onClose, onConfirmation }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Close this job?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          There will be no more job applications to this job.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirmation} color="primary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
