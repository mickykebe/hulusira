import { useEffect } from "react";

export default function GoogleAd({
  className = "",
  style = {},
  dataAdLayout,
  dataAdFormat = "fluid",
  dataAdLayoutKey,
  dataAdSlot,
  dataFullWidthResponsive
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);
  if (process.env.NODE_ENV === "production") {
    return (
      <Box className={className}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", ...style }}
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
