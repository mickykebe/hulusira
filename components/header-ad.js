import ***REMOVED*** Box ***REMOVED*** from "@material-ui/core";

export default function HeaderAd(***REMOVED*** className = "" ***REMOVED***) ***REMOVED***
  if (process.env.NODE_ENV === "production") ***REMOVED***
    return (
      <Box className=***REMOVED***className***REMOVED*** mb=***REMOVED***2***REMOVED***>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <ins
          className="adsbygoogle"
          style=***REMOVED******REMOVED*** display: "block" ***REMOVED******REMOVED***
          data-ad-client="ca-pub-1430919979045648"
          data-ad-slot="7862886800"
          data-ad-format="horizontal"
          data-full-width-responsive="true"></ins>
        <script
          dangerouslySetInnerHTML=***REMOVED******REMOVED***
            __html: "(adsbygoogle = window.adsbygoogle || []).push(***REMOVED******REMOVED***);"
          ***REMOVED******REMOVED***></script>
      </Box>
    );
  ***REMOVED***
  return null;
***REMOVED***
