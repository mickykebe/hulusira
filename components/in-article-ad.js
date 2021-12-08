import GoogleAd from "./google-ad";

export default function InArticleAd() {
  return (
    <GoogleAd
      style={{ textAlign: "center" }}
      dataAdLayout="in-article"
      dataAdSlot={process.env.NEXT_PUBLIC_ADSENSE_IN_ARTICLE_AD_SLOT}
      dataAdFormat="fluid"
      dataFullWidthResponsive={false}
    />
  );
}
