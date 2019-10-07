const axios = require("axios");
const db = require("../db");

const BOT_SEND_MESSAGE_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

const sendPostToTelegram = async function({ job, company }) {
  const message = `💼 ${job.position}
🕔 ${job.jobType}${job.location ? `\n📍 ${job.location}` : ""}${
    job.salary ? `\n💰 ${job.salary}` : ""
  }${company ? `\n🏢 ${company.name}` : ""}

To apply for this job visit: ${process.env.ROOT_URL}/jobs/${job.slug}`;
  try {
    const { data: response } = await axios.post(BOT_SEND_MESSAGE_URL, {
      chat_id: `@${process.env.TELEGRAM_CHANNEL_USERNAME}`,
      text: message
    });
    if (response.ok) {
      const messageId = response.result.message_id;
      return messageId;
    }
  } catch (error) {
    console.error("Problem posting job to telegram");
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  }
};

exports.sendPostToTelegram = sendPostToTelegram;

exports.postJobToChannel = async function(jobData) {
  const messageId = await sendPostToTelegram(jobData);
  if (messageId) {
    await db.createJobTelegramMessage(job.id, messageId);
  }
};

exports.closeJobPost = async function(messageId) {
  return axios.post(BOT_SEND_MESSAGE_URL, {
    chat_id: `@${process.env.TELEGRAM_CHANNEL_USERNAME}`,
    text: `🔒 Job Closed`,
    reply_to_message_id: messageId
  });
};
