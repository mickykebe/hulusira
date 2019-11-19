import ***REMOVED*** useEffect ***REMOVED*** from "react";
import ***REMOVED*** Box ***REMOVED*** from "@material-ui/core";

export default function GoogleAd(***REMOVED***
  className = "",
  style = ***REMOVED******REMOVED***,
  dataAdLayout,
  dataAdFormat = "fluid",
  dataAdLayoutKey,
  dataAdSlot,
  dataFullWidthResponsive
***REMOVED***) ***REMOVED***
  useEffect(() => ***REMOVED***
    if (process.env.NODE_ENV === "production") ***REMOVED***
      (window.adsbygoogle = window.adsbygoogle || []).push(***REMOVED******REMOVED***);
    ***REMOVED***
  ***REMOVED***, []);
  if (process.env.NODE_ENV === "production") ***REMOVED***
    return (
      <Box minWidth=***REMOVED***250***REMOVED*** className=***REMOVED***className***REMOVED***>
        <ins
          className="adsbygoogle"
          style=***REMOVED******REMOVED*** display: "block", minWidth: 250, ...style ***REMOVED******REMOVED***
          data-ad-layout=***REMOVED***dataAdLayout***REMOVED***
          data-ad-format=***REMOVED***dataAdFormat***REMOVED***
          data-ad-layout-key=***REMOVED***dataAdLayoutKey***REMOVED***
          data-ad-client="ca-pub-1430919979045648"
          data-ad-slot=***REMOVED***dataAdSlot***REMOVED***
          data-full-width-responsive=***REMOVED***dataFullWidthResponsive***REMOVED***></ins>
      </Box>
    );
  ***REMOVED***
  return null;
***REMOVED***
