const axios = require("axios");
const db = require("../db");

const BOT_SEND_MESSAGE_URL = `https://api.telegram.org/bot$***REMOVED***process.env.TELEGRAM_BOT_TOKEN***REMOVED***/sendMessage`;

const sendPostToTelegram = async function(***REMOVED*** job, company ***REMOVED***) ***REMOVED***
  const message = `💼 $***REMOVED***job.position***REMOVED***
🕔 $***REMOVED***job.jobType***REMOVED***$***REMOVED***job.location ? `\n📍 $***REMOVED***job.location***REMOVED***` : ""***REMOVED***$***REMOVED***
    job.salary ? `\n💰 $***REMOVED***job.salary***REMOVED***` : ""
  ***REMOVED***$***REMOVED***company ? `\n🏢 $***REMOVED***company.name***REMOVED***` : ""***REMOVED***

📋 $***REMOVED***job.description***REMOVED***

To apply for this job visit: $***REMOVED***process.env.ROOT_URL***REMOVED***/jobs/$***REMOVED***job.slug***REMOVED***`;
  try ***REMOVED***
    const ***REMOVED*** data: response ***REMOVED*** = await axios.post(BOT_SEND_MESSAGE_URL, ***REMOVED***
      chat_id: `@$***REMOVED***process.env.TELEGRAM_CHANNEL_USERNAME***REMOVED***`,
      text: message
    ***REMOVED***);
    if (response.ok) ***REMOVED***
      const messageId = response.result.message_id;
      return messageId;
    ***REMOVED***
  ***REMOVED*** catch (error) ***REMOVED***
    console.log("Problem occurred posting to telegram");
    if (error.response) ***REMOVED***
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    ***REMOVED*** else if (error.request) ***REMOVED***
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    ***REMOVED*** else ***REMOVED***
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    ***REMOVED***
    console.log(error.config);
  ***REMOVED***
***REMOVED***;

exports.sendPostToTelegram = sendPostToTelegram;

exports.postJobToChannel = async function(jobData) ***REMOVED***
  const messageId = await sendPostToTelegram(jobData);
  if (messageId) ***REMOVED***
    await db.createJobTelegramMessage(job.id, messageId);
  ***REMOVED***
***REMOVED***;

exports.closeJobPost = async function(messageId) ***REMOVED***
  return axios.post(BOT_SEND_MESSAGE_URL, ***REMOVED***
    chat_id: `@$***REMOVED***process.env.TELEGRAM_CHANNEL_USERNAME***REMOVED***`,
    text: `🔒 Job Closed`,
    reply_to_message_id: messageId
  ***REMOVED***);
***REMOVED***;
