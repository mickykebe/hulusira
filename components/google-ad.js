import { useEffect } from "react";
import { Box } from "@material-ui/core";

export default function GoogleAd({
  className = "",
  style = {},
  dataAdLayout,
  dataAdFormat,
  dataAdLayoutKey,
  dataAdSlot,
  dataFullWidthResponsive,
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);
  if (process.env.NODE_ENV === "production") {
    return (
      <Box minWidth={250} className={className}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", minWidth: 250, ...style }}
          data-ad-layout={dataAdLayout}
          data-ad-format={dataAdFormat}
          data-ad-layout-key={dataAdLayoutKey}
          data-ad-client="ca-pub-1430919979045648"
          data-ad-slot={dataAdSlot}
          data-full-width-responsive={dataFullWidthResponsive}></ins>
      </Box>
    );
  }
  return null;
}
