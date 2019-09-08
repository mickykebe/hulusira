import { Typography } from "@material-ui/core";
import Markdown from "markdown-to-jsx";

export default function MD({ children }) {
  return (
    <Markdown
      options={{
        overrides: {
          h1: {
            component: Typography,
            props: {
              variant: "h6"
            }
          }
        }
      }}>
      {children}
    </Markdown>
  );
}
