const axios = require("axios");
const db = require("../db");
const ***REMOVED*** logAxiosErrors ***REMOVED*** = require("../utils");
const format = require("date-fns/format");

const TELEGRAM_API_BASE_URL = `https://api.telegram.org/bot$***REMOVED***process.env.TELEGRAM_BOT_TOKEN***REMOVED***`;

const createJobMessage = (***REMOVED*** job, company ***REMOVED***) => ***REMOVED***
  return `💼 $***REMOVED***job.position***REMOVED***

🕔 $***REMOVED***job.jobType***REMOVED***$***REMOVED***company ? `\n\n🏢 $***REMOVED***company.name***REMOVED***` : ""***REMOVED***$***REMOVED***
    job.location ? `\n\n📍 $***REMOVED***job.location***REMOVED***` : ""
  ***REMOVED***$***REMOVED***job.salary ? `\n\n💰 $***REMOVED***job.salary***REMOVED***` : ""***REMOVED***$***REMOVED***
    job.deadline
      ? `\n\n⏲️ Deadline: $***REMOVED***format(new Date(job.deadline), "MMM dd, yyyy")***REMOVED***`
      : ""
  ***REMOVED***
  
📋 $***REMOVED***job.description***REMOVED***`;
***REMOVED***;

const sendPostToFacebook = async function(message, jobUrl) ***REMOVED***
  try ***REMOVED***
    const ***REMOVED*** data: response ***REMOVED*** = await axios
      .post(
        `https://graph.facebook.com/$***REMOVED***
          process.env.FB_PAGE_ID
        ***REMOVED***/feed?message=$***REMOVED***encodeURIComponent(message)***REMOVED***&link=$***REMOVED***encodeURIComponent(
          jobUrl
        )***REMOVED***&access_token=$***REMOVED***process.env.FB_PAGE_ACCESS_TOKEN***REMOVED***`
      )
      .catch(logAxiosErrors);
    if (response.id) ***REMOVED***
      return response.id;
    ***REMOVED***
  ***REMOVED*** catch (error) ***REMOVED***
    console.log("Couldn't post job to facebook");
  ***REMOVED***
***REMOVED***;

const sendPostToTelegram = async function(message, jobUrl) ***REMOVED***
  try ***REMOVED***
    const ***REMOVED*** data: response ***REMOVED*** = await axios
      .post(`$***REMOVED***TELEGRAM_API_BASE_URL***REMOVED***/sendMessage`, ***REMOVED***
        chat_id: `@$***REMOVED***process.env.TELEGRAM_CHANNEL_USERNAME***REMOVED***`,
        text: message,
        reply_markup: ***REMOVED***
          inline_keyboard: [
            [
              ***REMOVED***
                text: "Apply",
                url: jobUrl
              ***REMOVED***
            ]
          ]
        ***REMOVED***
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
  const messageBody = createJobMessage(jobData);
  const jobUrl = `$***REMOVED***process.env.ROOT_URL***REMOVED***/jobs/$***REMOVED***jobData.job.slug***REMOVED***`;
  const telegramMessage = messageBody;
  const facebookMessage = `ክፍት የስራ ቦታ ማስታወቅያ
  
$***REMOVED***messageBody***REMOVED***`;
  const [telegramMessageId, facebookPostId] = await Promise.all(
    [
      sendPostToTelegram(telegramMessage, jobUrl),
      sendPostToFacebook(facebookMessage, jobUrl)
    ].map(p => p.catch(() => undefined))
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

const postCloseJobToTelegram = async function(messageId, jobData) ***REMOVED***
  if (!messageId) ***REMOVED***
    return;
  ***REMOVED***

  const closedMessage = `--------- 🔒 JOB CLOSED --------- \n\n\n$***REMOVED***createJobMessage(
    jobData
  )***REMOVED***`;

  return axios
    .post(`$***REMOVED***TELEGRAM_API_BASE_URL***REMOVED***/editMessageText`, ***REMOVED***
      chat_id: `@$***REMOVED***process.env.TELEGRAM_CHANNEL_USERNAME***REMOVED***`,
      message_id: messageId,
      text: closedMessage
    ***REMOVED***)
    .catch(logAxiosErrors);

  /* return axios
    .post(TELEGRAM_SEND_MESSAGE_URL, ***REMOVED***
      chat_id: `@$***REMOVED***process.env.TELEGRAM_CHANNEL_USERNAME***REMOVED***`,
      text: `🔒 Job Closed`,
      reply_to_message_id: messageId
    ***REMOVED***)
    .catch(logAxiosErrors); */
***REMOVED***;

exports.postJobCloseToSocialMedia = async function(jobData) ***REMOVED***
  const messageIds = await db.getJobSocialPost(jobData.job.id);
  if (!messageIds) ***REMOVED***
    return;
  ***REMOVED***
  const ***REMOVED*** telegramMessageId, facebookPostId ***REMOVED*** = messageIds;
  try ***REMOVED***
    await Promise.all([
      postCloseJobToTelegram(telegramMessageId, jobData),
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
