import ***REMOVED*** useEffect ***REMOVED*** from "react";

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
      (adsbygoogle = window.adsbygoogle || []).push(***REMOVED******REMOVED***);
    ***REMOVED***
  ***REMOVED***, []);
  if (process.env.NODE_ENV === "production") ***REMOVED***
    return (
      <Box className=***REMOVED***className***REMOVED***>
        <ins
          className="adsbygoogle"
          style=***REMOVED******REMOVED*** display: "block", ...style ***REMOVED******REMOVED***
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
