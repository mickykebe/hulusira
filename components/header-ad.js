import GoogleAd from "./google-ad";

export default function HeaderAd({ className }) {
  return (
    <GoogleAd
      className={className}
      dataAdFormat="horizontal"
      dataAdSlot="7862886800"
      dataFullWidthResponsive="true"
    />
  );
}
