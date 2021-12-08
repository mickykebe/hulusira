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
    if (
      process.env.NODE_ENV === "production" &&
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID &&
      dataAdSlot
    ) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID &&
    dataAdSlot
  ) {
    return (
      <Box minWidth={250} className={className} align="center">
        <ins
          className="adsbygoogle"
          style={{ display: "block", minWidth: 250, ...style }}
          data-ad-layout={dataAdLayout}
          data-ad-format={dataAdFormat}
          data-ad-layout-key={dataAdLayoutKey}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
          data-ad-slot={dataAdSlot}
          data-full-width-responsive={dataFullWidthResponsive}></ins>
      </Box>
    );
  }
  return null;
}
