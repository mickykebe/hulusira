const axios = require("axios");
const db = require("../db");
const ***REMOVED*** logAxiosErrors ***REMOVED*** = require("../utils");

const TELEGRAM_SEND_MESSAGE_URL = `https://api.telegram.org/bot$***REMOVED***process.env.TELEGRAM_BOT_TOKEN***REMOVED***/sendMessage`;

const createJobMessage = (***REMOVED*** job, company ***REMOVED***) => ***REMOVED***
  return `💼 $***REMOVED***job.position***REMOVED***
🕔 $***REMOVED***job.jobType***REMOVED***$***REMOVED***job.location ? `\n📍 $***REMOVED***job.location***REMOVED***` : ""***REMOVED***$***REMOVED***
    job.salary ? `\n💰 $***REMOVED***job.salary***REMOVED***` : ""
  ***REMOVED***$***REMOVED***company ? `\n🏢 $***REMOVED***company.name***REMOVED***` : ""***REMOVED***

📋 $***REMOVED***job.description***REMOVED***

To apply for this job visit: $***REMOVED***process.env.ROOT_URL***REMOVED***/jobs/$***REMOVED***job.slug***REMOVED***`;
***REMOVED***;

const sendPostToFacebook = async function(message) ***REMOVED***
  try ***REMOVED***
    const ***REMOVED*** data: response ***REMOVED*** = await axios
      .post(
        `https://graph.facebook.com/$***REMOVED***
          process.env.FB_PAGE_ID
        ***REMOVED***/feed?message=$***REMOVED***encodeURIComponent(message)***REMOVED***&access_token=$***REMOVED***
          process.env.FB_PAGE_ACCESS_TOKEN
        ***REMOVED***`
      )
      .catch(logAxiosErrors);
    if (response.id) ***REMOVED***
      return response.id;
    ***REMOVED***
  ***REMOVED*** catch (error) ***REMOVED***
    console.log("Couldn't post job to facebook");
  ***REMOVED***
***REMOVED***;

const sendPostToTelegram = async function(message) ***REMOVED***
  try ***REMOVED***
    const ***REMOVED*** data: response ***REMOVED*** = await axios
      .post(TELEGRAM_SEND_MESSAGE_URL, ***REMOVED***
        chat_id: `@$***REMOVED***process.env.TELEGRAM_CHANNEL_USERNAME***REMOVED***`,
        text: message
      ***REMOVED***)
      .catch(logAxiosErrors);
    if (response.ok) ***REMOVED***
      const messageId = response.result.message_id;
      return messageId;
    ***REMOVED***
  ***REMOVED*** catch (error) ***REMOVED***
    console.log("Couldn't post job to telegram");
  ***REMOVED***
***REMOVED***;

exports.postJobToSocialMedia = async function(jobData) ***REMOVED***
  const message = createJobMessage(jobData);
  const [telegramMessageId, facebookPostId] = await Promise.all(
    [sendPostToTelegram(message), sendPostToFacebook(message)].map(p =>
      p.catch(() => undefined)
    )
  );
  await db.createJobSocialPost(jobData.job.id, ***REMOVED***
    telegramMessageId,
    facebookPostId
  ***REMOVED***);
***REMOVED***;

const postCloseJobToFacebook = async function(fbPostId, jobData) ***REMOVED***
  if (!fbPostId) ***REMOVED***
    return;
  ***REMOVED***
  const closedMessage = `--------- 🔒 JOB CLOSED --------- \n\n\n$***REMOVED***createJobMessage(
    jobData
  )***REMOVED***`;
  return axios
    .post(
      `https://graph.facebook.com/v4.0/$***REMOVED***fbPostId***REMOVED***?message=$***REMOVED***encodeURIComponent(
        closedMessage
      )***REMOVED***&access_token=$***REMOVED***process.env.FB_PAGE_ACCESS_TOKEN***REMOVED***`
    )
    .catch(logAxiosErrors);
***REMOVED***;

const postCloseJobToTelegram = async function(messageId) ***REMOVED***
  if (!messageId) ***REMOVED***
    return;
  ***REMOVED***
  return axios
    .post(TELEGRAM_SEND_MESSAGE_URL, ***REMOVED***
      chat_id: `@$***REMOVED***process.env.TELEGRAM_CHANNEL_USERNAME***REMOVED***`,
      text: `🔒 Job Closed`,
      reply_to_message_id: messageId
    ***REMOVED***)
    .catch(logAxiosErrors);
***REMOVED***;

exports.postJobCloseToSocialMedia = async function(jobData) ***REMOVED***
  const ***REMOVED*** telegramMessageId, facebookPostId ***REMOVED*** = await db.getJobSocialPost(
    jobData.job.id
  );
  try ***REMOVED***
    await Promise.all([
      postCloseJobToTelegram(telegramMessageId),
      postCloseJobToFacebook(facebookPostId, jobData)
    ]);
  ***REMOVED*** catch (err) ***REMOVED***
    console.log(`Problem occurred trying to post job closure to social media`);
  ***REMOVED***
***REMOVED***;

exports.createJobMessage = createJobMessage;
exports.sendPostToTelegram = sendPostToTelegram;
exports.sendPostToFacebook = sendPostToFacebook;
exports.postCloseJobToFacebook = postCloseJobToFacebook;
exports.postCloseJobToTelegram = postCloseJobToTelegram;
