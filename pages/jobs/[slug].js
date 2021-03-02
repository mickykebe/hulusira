import { useEffect, useState, useReducer } from "react";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import nextCookie from "next-cookies";
import api from "../../api";
import Layout from "../../components/layout";
import JobContentManage from "../../components/job-content-manage";

function Job({ user, jobData, adminToken }) {
  const [isValidToken, setIsValidToken] = useState(false);
  useEffect(() => {
    const verifyToken = async (id, adminToken) => {
      try {
        await api.verifyJobToken(id, adminToken);
        setIsValidToken(true);
      } catch (err) {
        setIsValidToken(false);
      }
    };
    const { job } = jobData;
    if (adminToken) {
      verifyToken(job.id, adminToken);
    }
  }, [jobData, setIsValidToken, adminToken]);
  const closeJob = async () => {
    await api.closeJob(jobData.job.id, adminToken);
    Router.push("/");
  };
  useEffect(() => {
    api.openPage(jobData.job.slug);
  }, [jobData.job.slug]);
  const metaTitle = `${jobData.job.position}${
    jobData.company ? ` at ${jobData.company.name}` : ""
  }`;
  const metaDescription = `${
    jobData.company ? `${jobData.company.name} is h` : "H"
  }iring ${jobData.job.position}. ${jobData.job.description.slice(0, 250)}...`;
  const router = useRouter();
  const url = `${process.env.NEXT_PUBLIC_ROOT_URL}${router.asPath}`;
  const defaultThumbnailUrl = `${process.env.NEXT_PUBLIC_ROOT_URL}/static/hulusira.png`;
  return (
    <Layout user={user}>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={metaDescription} />
        <meta
          property="og:image"
          content={
            (jobData.company && jobData.company.logo) || defaultThumbnailUrl
          }
        />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta
          property="twitter:image:src"
          content={
            (jobData.company && jobData.company.logo) || defaultThumbnailUrl
          }
        />
        <meta property="twitter:url" content={url} />
      </Head>
      <JobContentManage
        isJobOwner={isValidToken}
        jobData={jobData}
        onJobClose={closeJob}
        withAds={true}
      />
    </Layout>
  );
}

Job.getInitialProps = async (ctx) => {
  const { slug } = ctx.query;
  const cookies = nextCookie(ctx);
  const adminToken = cookies[slug];
  const jobData = await api.getJob(ctx, slug, adminToken);
  return { jobData, adminToken };
};

export default Job;
