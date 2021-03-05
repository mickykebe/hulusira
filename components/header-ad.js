import GoogleAd from "./google-ad";

export default function HeaderAd({ className }) {
  return (
    <GoogleAd
      style={{ height: 120 }}
      className={className}
      dataAdFormat="horizontal"
      dataAdSlot="7862886800"
      dataFullWidthResponsive="true"
    />
  );
}
