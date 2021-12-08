import GoogleAd from "./google-ad";

export default function HeaderAd({ className, adStyle = {} }) {
  return (
    <GoogleAd
      style={adStyle}
      className={className}
      dataAdFormat="horizontal"
      dataAdSlot={process.env.NEXT_PUBLIC_ADSENSE_HEADER_AD_SLOT}
      dataFullWidthResponsive="true"
    />
  );
}
