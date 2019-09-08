import { useState, useEffect } from 'react';
import clsx from "clsx";
import { Snackbar, SnackbarContent, IconButton } from "@material-ui/core";
import { amber, green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.main
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
}));

export default function HSSnackBar({
  open = false,
  variant = "info",
  message,
  onClose,
  ...props
}) {
  const [show, setShow] = useState(open);
  const classes = useStyles();
  const Icon = variantIcon[variant];
  useEffect(() => {
    setShow(open);
  }, [open]);
  const handleClose = () => setShow(false);
  return (
    <Snackbar onClose={handleClose} open={show} {...props}>
      <SnackbarContent
        className={classes[variant]}
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
            {message}
          </span>
        }
        action={[
          <IconButton key="close" color="inherit" onClick={handleClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>
        ]}
      />
    </Snackbar>
  );
}
