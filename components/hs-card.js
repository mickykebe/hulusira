import { Card, CardContent, CardHeader } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: theme.boxShadows[0]
  },
  cardContent: {
    paddingTop: 0
  },
  cardHeaderTitle: {
    fontSize: "1.2rem",
    fontWeight: 800
  }
}));

export default function HSCard({ className, children, title }) {
  const classes = useStyles();
  return (
    <Card
      className={className}
      classes={{
        root: classes.root
      }}>
      {title && (
        <CardHeader
          title={title}
          classes={{
            title: classes.cardHeaderTitle
          }}
        />
      )}
      <CardContent
        classes={{
          root: classes.cardContent
        }}>
        {children}
      </CardContent>
    </Card>
  );
}
