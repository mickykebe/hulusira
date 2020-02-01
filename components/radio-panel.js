import clsx from "clsx";
import { Radio, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  root: props => ({
    ...(props.checked && { backgroundColor: "#fafafa" })
  })
});

export default function RadioPanel({
  name,
  value,
  checked,
  primaryLabel,
  secondaryLabel,
  className = ""
}) {
  const classes = useStyles({ checked });
  return (
    <Box
      className={clsx(className, classes.root)}
      display="flex"
      borderColor="grey.200"
      border={1}
      p={2}>
      <Radio color="primary" value={value} name={name} checked={checked} />
      <Box>
        <Typography variant="subtitle2" pb={1}>
          {primaryLabel}
        </Typography>
        {secondaryLabel && (
          <Typography variant="body2">{secondaryLabel}</Typography>
        )}
      </Box>
    </Box>
  );
}
