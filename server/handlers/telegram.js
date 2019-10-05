const axios = require("axios");
const db = require("../db");

const BOT_SEND_MESSAGE_URL = `https://api.telegram.org/bot$***REMOVED***process.env.TELEGRAM_BOT_TOKEN***REMOVED***/sendMessage`;

exports.postJobToChannel = async function(***REMOVED*** job, company ***REMOVED***) ***REMOVED***
  const message = `💼 $***REMOVED***job.position***REMOVED***
🕔 $***REMOVED***job.jobType***REMOVED***$***REMOVED***job.location ? `\n📍 $***REMOVED***job.location***REMOVED***` : ""***REMOVED***$***REMOVED***
    job.salary ? `\n💰 $***REMOVED***job.salary***REMOVED***` : ""
  ***REMOVED***$***REMOVED***company ? `\n🏢 $***REMOVED***company.name***REMOVED***` : ""***REMOVED***

📋 $***REMOVED***job.description***REMOVED***

To apply for this job visit: $***REMOVED***process.env.ROOT_URL***REMOVED***/jobs/$***REMOVED***job.slug***REMOVED***`;
  try ***REMOVED***
    const ***REMOVED*** data: response ***REMOVED*** = await axios.post(BOT_SEND_MESSAGE_URL, ***REMOVED***
      chat_id: `@$***REMOVED***process.env.TELEGRAM_CHANNEL_USERNAME***REMOVED***`,
      parse_mode: "Markdown",
      text: message
    ***REMOVED***);
    if (response.ok) ***REMOVED***
      const messageId = response.result.message_id;
      await db.createJobTelegramMessage(job.id, messageId);
    ***REMOVED***
  ***REMOVED*** catch (err) ***REMOVED***
    console.error("Problem posting job to telegram channel", err);
  ***REMOVED***
***REMOVED***;

exports.closeJobPost = async function(messageId) ***REMOVED***
  return axios.post(BOT_SEND_MESSAGE_URL, ***REMOVED***
    chat_id: `@$***REMOVED***process.env.TELEGRAM_CHANNEL_USERNAME***REMOVED***`,
    text: `🔒 Job Closed`,
    reply_to_message_id: messageId
  ***REMOVED***);
***REMOVED***;
