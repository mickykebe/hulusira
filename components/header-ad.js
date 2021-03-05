import GoogleAd from "./google-ad";

export default function HeaderAd({ className, adStyle = {} }) {
  return (
    <GoogleAd
      style={adStyle}
      className={className}
      dataAdFormat="horizontal"
      dataAdSlot="7862886800"
      dataFullWidthResponsive="true"
    />
  );
}
