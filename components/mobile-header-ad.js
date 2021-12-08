import GoogleAd from "./google-ad";

export default function MobileHeaderAd() {
  return (
    <GoogleAd
      style={{ display: "inline-block", width: 320, height: 50 }}
      dataAdSlot={process.env.NEXT_PUBLIC_ADSENSE_MOBILE_HEADER_AD_SLOT}
    />
  );
}
