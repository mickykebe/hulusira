import GoogleAd from "./google-ad";

export default function FeedAd({ className }) {
  return (
    <GoogleAd
      className={className}
      dataAdLayouKey="-ha-6+1u-6q+8y"
      dataAdSlot={process.env.NEXT_PUBLIC_ADSENSE_FEED_AD_SLOT}
      dataAdFormat="fluid"
      style={{ height: 120 }}
    />
  );
}
