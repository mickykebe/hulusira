import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Markdown from "markdown-to-jsx";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    "& p": {
      marginTop: "1.25rem",
      marginBottom: "1.25rem",
    },
  },
}));

export default function MD({ children }) {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <Markdown
        options={{
          overrides: {
            h1: {
              component: Typography,
              props: {
                variant: "h6",
              },
            },
            ul: {
              component: Typography,
              props: {
                variant: "body1",
              },
            },
            ol: {
              component: Typography,
              props: {
                variant: "body1",
              },
            },
            p: {
              component: Typography,
              props: {
                variant: "body1",
              },
            },
            span: {
              component: Typography,
              props: {
                variant: "body1",
              },
            },
          },
        }}>
        {children}
      </Markdown>
    </div>
  );
}
