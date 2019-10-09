const axios = require("axios");
const db = require("../db");
const { logAxiosErrors } = require("../utils");

const TELEGRAM_SEND_MESSAGE_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

const createJobMessage = ({ job, company }) => {
  return `💼 ${job.position}
🕔 ${job.jobType}${job.location ? `\n📍 ${job.location}` : ""}${
    job.salary ? `\n💰 ${job.salary}` : ""
  }${company ? `\n🏢 ${company.name}` : ""}

📋 ${job.description}

To apply for this job visit: ${process.env.ROOT_URL}/jobs/${job.slug}`;
};

const sendPostToFacebook = async function(message) {
  try {
    const { data: response } = await axios
      .post(
        `https://graph.facebook.com/${
          process.env.FB_PAGE_ID
        }/feed?message=${encodeURIComponent(message)}&access_token=${
          process.env.FB_PAGE_ACCESS_TOKEN
        }`
      )
      .catch(logAxiosErrors);
    if (response.id) {
      return response.id;
    }
  } catch (error) {
    console.log("Couldn't post job to facebook");
  }
};

const sendPostToTelegram = async function(message) {
  try {
    const { data: response } = await axios
      .post(TELEGRAM_SEND_MESSAGE_URL, {
        chat_id: `@${process.env.TELEGRAM_CHANNEL_USERNAME}`,
        text: message
      })
      .catch(logAxiosErrors);
    if (response.ok) {
      const messageId = response.result.message_id;
      return messageId;
    }
  } catch (error) {
    console.log("Couldn't post job to telegram");
  }
};

exports.postJobToSocialMedia = async function(jobData) {
  const message = createJobMessage(jobData);
  const [telegramMessageId, facebookPostId] = await Promise.all(
    [sendPostToTelegram(message), sendPostToFacebook(message)].map(p =>
      p.catch(() => undefined)
    )
  );
  await db.createJobSocialPost(jobData.job.id, {
    telegramMessageId,
    facebookPostId
  });
};

const postCloseJobToFacebook = async function(fbPostId, jobData) {
  if (!fbPostId) {
    return;
  }
  const closedMessage = `--------- 🔒 JOB CLOSED --------- \n\n\n${createJobMessage(
    jobData
  )}`;
  return axios
    .post(
      `https://graph.facebook.com/v4.0/${fbPostId}?message=${encodeURIComponent(
        closedMessage
      )}&access_token=${process.env.FB_PAGE_ACCESS_TOKEN}`
    )
    .catch(logAxiosErrors);
};

const postCloseJobToTelegram = async function(messageId) {
  if (!messageId) {
    return;
  }
  return axios
    .post(TELEGRAM_SEND_MESSAGE_URL, {
      chat_id: `@${process.env.TELEGRAM_CHANNEL_USERNAME}`,
      text: `🔒 Job Closed`,
      reply_to_message_id: messageId
    })
    .catch(logAxiosErrors);
};

exports.postJobCloseToSocialMedia = async function(jobData) {
  const { telegramMessageId, facebookPostId } = await db.getJobSocialPost(
    jobData.job.id
  );
  try {
    await Promise.all([
      postCloseJobToTelegram(telegramMessageId),
      postCloseJobToFacebook(facebookPostId, jobData)
    ]);
  } catch (err) {
    console.log(`Problem occurred trying to post job closure to social media`);
  }
};

exports.createMessage = createJobMessage;
exports.sendPostToTelegram = sendPostToTelegram;
exports.sendPostToFacebook = sendPostToFacebook;
exports.postCloseJobToFacebook = postCloseJobToFacebook;
exports.postCloseJobToTelegram = postCloseJobToTelegram;
