import { Fragment } from "react";

export default function HeaderAd() {
  if (process.env.NODE_ENV === "production") {
    return (
      <Fragment>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-1430919979045648"
          data-ad-slot="7862886800"
          data-ad-format="horizontal"
          data-full-width-responsive="true"></ins>
        <script
          dangerouslySetInnerHTML={{
            __html: "(adsbygoogle = window.adsbygoogle || []).push({});"
          }}></script>
      </Fragment>
    );
  }
  return null;
}
