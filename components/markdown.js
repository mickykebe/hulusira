import ***REMOVED*** Typography ***REMOVED*** from "@material-ui/core";
import Markdown from "markdown-to-jsx";

export default function MD(***REMOVED*** children ***REMOVED***) ***REMOVED***
  return (
    <Markdown
      options=***REMOVED******REMOVED***
        overrides: ***REMOVED***
          h1: ***REMOVED***
            component: Typography,
            props: ***REMOVED***
              variant: "h6"
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***
      ***REMOVED******REMOVED***>
      ***REMOVED***children***REMOVED***
    </Markdown>
  );
***REMOVED***
