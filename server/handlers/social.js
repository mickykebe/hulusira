const axios = require("axios");
const db = require("../db");
const { logAxiosErrors } = require("../utils");
const format = require("date-fns/format");

const TELEGRAM_API_BASE_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

const createJobMessage = ({ job, company }) => {
  return `💼 ${job.position}

🕔 ${job.jobType}${company ? `\n\n🏢 ${company.name}` : ""}${
    job.location ? `\n\n📍 ${job.location}` : ""
  }${job.salary ? `\n\n💰 ${job.salary}` : ""}${
    job.deadline
      ? `\n\n⏲️ Deadline: ${format(new Date(job.deadline), "MMM dd, yyyy")}`
      : ""
  }
  
📋 ${job.description}`;
};

const sendPostToFacebook = async function(message, jobUrl) {
  try {
    const { data: response } = await axios
      .post(
        `https://graph.facebook.com/${
          process.env.FB_PAGE_ID
        }/feed?message=${encodeURIComponent(message)}&link=${encodeURIComponent(
          jobUrl
        )}&access_token=${process.env.FB_PAGE_ACCESS_TOKEN}`
      )
      .catch(logAxiosErrors);
    if (response.id) {
      return response.id;
    }
  } catch (error) {
    console.log("Couldn't post job to facebook");
  }
};

const sendPostToTelegram = async function(message, jobUrl) {
  try {
    const { data: response } = await axios
      .post(`${TELEGRAM_API_BASE_URL}/sendMessage`, {
        chat_id: `@${process.env.TELEGRAM_CHANNEL_USERNAME}`,
        text: message,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Apply",
                url: jobUrl
              }
            ]
          ]
        }
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
  const messageBody = createJobMessage(jobData);
  const jobUrl = `${process.env.ROOT_URL}/jobs/${jobData.job.slug}`;
  const telegramMessage = messageBody;
  const facebookMessage = `ክፍት የስራ ቦታ ማስታወቅያ
  
${messageBody}`;
  const [telegramMessageId, facebookPostId] = await Promise.all(
    [
      sendPostToTelegram(telegramMessage, jobUrl),
      sendPostToFacebook(facebookMessage, jobUrl)
    ].map(p => p.catch(() => undefined))
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

const postCloseJobToTelegram = async function(messageId, jobData) {
  if (!messageId) {
    return;
  }

  const closedMessage = `--------- 🔒 JOB CLOSED --------- \n\n\n${createJobMessage(
    jobData
  )}`;

  return axios
    .post(`${TELEGRAM_API_BASE_URL}/editMessageText`, {
      chat_id: `@${process.env.TELEGRAM_CHANNEL_USERNAME}`,
      messageId,
      text: closedMessage
    })
    .catch(logAxiosErrors);

  /* return axios
    .post(TELEGRAM_SEND_MESSAGE_URL, {
      chat_id: `@${process.env.TELEGRAM_CHANNEL_USERNAME}`,
      text: `🔒 Job Closed`,
      reply_to_message_id: messageId
    })
    .catch(logAxiosErrors); */
};

exports.postJobCloseToSocialMedia = async function(jobData) {
  const messageIds = await db.getJobSocialPost(jobData.job.id);
  if (!messageIds) {
    return;
  }
  const { telegramMessageId, facebookPostId } = messageIds;
  try {
    await Promise.all([
      postCloseJobToTelegram(telegramMessageId, jobData),
      postCloseJobToFacebook(facebookPostId, jobData)
    ]);
  } catch (err) {
    console.log(`Problem occurred trying to post job closure to social media`);
  }
};

exports.createJobMessage = createJobMessage;
exports.sendPostToTelegram = sendPostToTelegram;
exports.sendPostToFacebook = sendPostToFacebook;
exports.postCloseJobToFacebook = postCloseJobToFacebook;
exports.postCloseJobToTelegram = postCloseJobToTelegram;
