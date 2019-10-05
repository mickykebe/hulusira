const axios = require("axios");
const db = require("../db");

const BOT_SEND_MESSAGE_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

exports.postJobToChannel = async function({ job, company }) {
  const message = `💼 ${job.position}
🕔 ${job.jobType}${job.location ? `\n📍 ${job.location}` : ""}${
    job.salary ? `\n💰 ${job.salary}` : ""
  }${company ? `\n🏢 ${company.name}` : ""}

📋 ${job.description}

To apply for this job visit: ${process.env.ROOT_URL}/jobs/${job.slug}`;
  try {
    const { data: response } = await axios.post(BOT_SEND_MESSAGE_URL, {
      chat_id: `@${process.env.TELEGRAM_CHANNEL_USERNAME}`,
      parse_mode: "Markdown",
      text: message
    });
    if (response.ok) {
      const messageId = response.result.message_id;
      await db.createJobTelegramMessage(job.id, messageId);
    }
  } catch (err) {
    console.error("Problem posting job to telegram channel", err);
  }
};

exports.closeJobPost = async function(messageId) {
  return axios.post(BOT_SEND_MESSAGE_URL, {
    chat_id: `@${process.env.TELEGRAM_CHANNEL_USERNAME}`,
    text: `🔒 Job Closed`,
    reply_to_message_id: messageId
  });
};
