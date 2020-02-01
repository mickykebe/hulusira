import { useEffect, useState } from "react";
import api from "../../api";
import Router, { useRouter } from "next/router";
import PageProgress from "../../components/page-progress";
import Banner from "../../components/banner";
import Layout from "../../components/layout";

export default function ConfirmUser() {
  const router = useRouter();
  const { confirmationKey } = router.query;
  const [confirmationStatus, setConfirmationStatus] = useState("confirming");

  useEffect(() => {
    async function confirmUser() {
      try {
        await api.confirmUser(confirmationKey);
        Router.push("/");
      } catch (err) {
        setConfirmationStatus("failed");
      }
    }
    confirmUser();
  }, [confirmationKey]);

  return (
    <Layout>
      {confirmationStatus === "failed" && (
        <Banner message="Problem occurred " />
      )}
      {confirmationStatus !== "failed" && <PageProgress />}
    </Layout>
  );
}
