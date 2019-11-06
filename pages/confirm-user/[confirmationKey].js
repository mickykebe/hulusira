import ***REMOVED*** useEffect, useState ***REMOVED*** from "react";
import api from "../../api";
import Router, ***REMOVED*** useRouter ***REMOVED*** from "next/router";
import PageProgress from "../../components/page-progress";
import Banner from "../../components/banner";
import Layout from "../../components/layout";

export default function ConfirmUser() ***REMOVED***
  console.log("hello there");
  const router = useRouter();
  const ***REMOVED*** confirmationKey ***REMOVED*** = router.query;
  const [confirmationStatus, setConfirmationStatus] = useState("confirming");

  useEffect(() => ***REMOVED***
    async function confirmUser() ***REMOVED***
      try ***REMOVED***
        await api.confirmUser(confirmationKey);
        Router.push("/");
      ***REMOVED*** catch (err) ***REMOVED***
        setConfirmationStatus("failed");
      ***REMOVED***
    ***REMOVED***
    confirmUser();
  ***REMOVED***, [confirmationKey]);

  return (
    <Layout>
      ***REMOVED***confirmationStatus === "failed" && (
        <Banner message="Problem occurred " />
      )***REMOVED***
      ***REMOVED***confirmationStatus !== "failed" && <PageProgress />***REMOVED***
    </Layout>
  );
***REMOVED***
