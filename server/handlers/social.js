const axios = require("axios");
const db = require("../db");
const ***REMOVED*** logAxiosErrors, careerLevelLabel ***REMOVED*** = require("../utils");
const format = require("date-fns/format");

const TELEGRAM_API_BASE_URL = `https://api.telegram.org/bot$***REMOVED***process.env.TELEGRAM_BOT_TOKEN***REMOVED***`;

const createJobMessage = (***REMOVED*** job, company ***REMOVED***) => ***REMOVED***
  return `💼 $***REMOVED***job.position***REMOVED***

🕔 $***REMOVED***job.jobType***REMOVED***$***REMOVED***company ? `\n\n🏢 $***REMOVED***company.name***REMOVED***` : ""***REMOVED***$***REMOVED***
    job.careerLevel ? `\n\n📈 $***REMOVED***careerLevelLabel(job.careerLevel)***REMOVED***` : ""
  ***REMOVED***$***REMOVED***job.location ? `\n\n📍 $***REMOVED***job.location***REMOVED***` : ""***REMOVED***$***REMOVED***
    job.salary ? `\n\n💰 $***REMOVED***job.salary***REMOVED***` : ""
  ***REMOVED***$***REMOVED***
    job.deadline
      ? `\n\n⏳ Deadline: $***REMOVED***format(new Date(job.deadline), "MMM dd, yyyy")***REMOVED***`
      : ""
  ***REMOVED***
  
📋 $***REMOVED***job.description***REMOVED***
$***REMOVED***job.tags.map(tag => `#$***REMOVED***tag.name.replace(/\s+/g, "_")***REMOVED***`).join(" ")***REMOVED***`;
***REMOVED***;

const sendPostToFacebook = async function(message, jobUrl, ***REMOVED*** scheduleTime ***REMOVED***) ***REMOVED***
  let fbPostId;
  const encodedMessage = encodeURIComponent(message);
  const encodedJobUrl = encodeURIComponent(jobUrl);
  try ***REMOVED***
    const ***REMOVED*** data: response ***REMOVED*** = await axios
      .post(
        `https://graph.facebook.com/$***REMOVED***process.env.FB_PAGE_ID***REMOVED***/feed?message=$***REMOVED***encodedMessage***REMOVED***&link=$***REMOVED***encodedJobUrl***REMOVED***&access_token=$***REMOVED***process.env.FB_PAGE_ACCESS_TOKEN***REMOVED***`
      )
      .catch(logAxiosErrors);
    if (response.id) ***REMOVED***
      fbPostId = response.id;
    ***REMOVED***
    if (scheduleTime) ***REMOVED***
      const shareablePages = JSON.parse(process.env.SHARING_FB_PAGES) || [];
      await Promise.all(
        shareablePages.map((page, index) => ***REMOVED***
          //within 30 minutes of each other
          const time = scheduleTime + index * 1800;
          return axios
            .post(
              `https://graph.facebook.com/$***REMOVED***page.id***REMOVED***/feed?message=$***REMOVED***encodedMessage***REMOVED***&link=https://www.facebook.com/$***REMOVED***fbPostId***REMOVED***&access_token=$***REMOVED***page.token***REMOVED***&published=false&scheduled_publish_time=$***REMOVED***time***REMOVED***`
            )
            .catch(logAxiosErrors);
        ***REMOVED***)
      );
    ***REMOVED***
  ***REMOVED*** catch (error) ***REMOVED***
    console.log("Problem occurred posting job to facebook");
  ***REMOVED*** finally ***REMOVED***
    return fbPostId;
  ***REMOVED***
***REMOVED***;

const sendPostToTelegram = async function(channelUsername, message, jobUrl) ***REMOVED***
  try ***REMOVED***
    const ***REMOVED*** data: response ***REMOVED*** = await axios
      .post(`$***REMOVED***TELEGRAM_API_BASE_URL***REMOVED***/sendMessage`, ***REMOVED***
        chat_id: `@$***REMOVED***channelUsername***REMOVED***`,
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

exports.postJobToSocialMedia = async function(jobData, ***REMOVED*** fbSchedule ***REMOVED***) ***REMOVED***
  const messageBody = createJobMessage(jobData);
  const jobUrl = `$***REMOVED***process.env.ROOT_URL***REMOVED***/jobs/$***REMOVED***jobData.job.slug***REMOVED***`;
  const jobFacebookUrl = `$***REMOVED***jobUrl***REMOVED***?utm_source=HuluSira%20Facebook%20Page&utm_medium=facebook&utm_campaign=$***REMOVED***jobData.job.slug***REMOVED***`;
  const telegramMessage = messageBody;
  const facebookMessage = `ክፍት የስራ ቦታ ማስታወቅያ
  
$***REMOVED***messageBody***REMOVED***
$***REMOVED***jobFacebookUrl***REMOVED***

💬 ትኩስ ስራዎች እንደወጡ እንዲደርስዎ ቴሌግራም ቻናላችንን ተቀላቀሉ፡ https://t.me/joinchat/AAAAAFZnrdEWsYxQugEU3A`;

  let telegramMessages = null;
  const telegramChannelUsernames = (
    process.env.TELEGRAM_CHANNEL_USERNAMES || ""
  )
    .split(" ")
    .filter(userName => !!userName);
  if (telegramChannelUsernames.length > 0) ***REMOVED***
    let messageIds = await Promise.all(
      telegramChannelUsernames
        .map(channelUserName => ***REMOVED***
          const jobTelegramUrl = `$***REMOVED***jobUrl***REMOVED***?utm_source=$***REMOVED***encodeURIComponent(
            `$***REMOVED***channelUserName***REMOVED*** Telegram Channel`
          )***REMOVED***&utm_medium=telegram&utm_campaign=$***REMOVED***jobData.job.slug***REMOVED***`;
          return sendPostToTelegram(
            channelUserName,
            telegramMessage,
            jobTelegramUrl
          );
        ***REMOVED***)
        .map(p => p.catch(() => null))
    );
    const messages = messageIds
      .map((messageId, index) => (***REMOVED***
        channelUserName: telegramChannelUsernames[index],
        messageId
      ***REMOVED***))
      .filter(message => message.messageId !== null);
    telegramMessages = JSON.stringify(messages);
  ***REMOVED***

  const facebookPostId = await sendPostToFacebook(
    facebookMessage,
    jobFacebookUrl,
    ***REMOVED*** scheduleTime: fbSchedule ***REMOVED***
  ).catch(() => null);
  await db.createJobSocialPost(jobData.job.id, ***REMOVED***
    telegramMessages,
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

const postCloseJobToTelegram = async function(
  channelUserName,
  messageId,
  jobData
) ***REMOVED***
  if (!messageId) ***REMOVED***
    return;
  ***REMOVED***

  const closedMessage = `--------- 🔒 JOB CLOSED --------- \n\n\n$***REMOVED***createJobMessage(
    jobData
  )***REMOVED***`;

  return axios
    .post(`$***REMOVED***TELEGRAM_API_BASE_URL***REMOVED***/editMessageText`, ***REMOVED***
      chat_id: `@$***REMOVED***channelUserName***REMOVED***`,
      message_id: messageId,
      text: closedMessage
    ***REMOVED***)
    .catch(logAxiosErrors);
***REMOVED***;

exports.postJobCloseToSocialMedia = async function(jobData) ***REMOVED***
  const messageIds = await db.getJobSocialPost(jobData.job.id);
  if (!messageIds) ***REMOVED***
    return;
  ***REMOVED***
  const ***REMOVED*** telegramMessages, telegramMessageId, facebookPostId ***REMOVED*** = messageIds;

  if (!!telegramMessages) ***REMOVED***
    try ***REMOVED***
      await Promise.all(
        telegramMessages.map(message => ***REMOVED***
          return postCloseJobToTelegram(
            message.channelUserName,
            message.messageId,
            jobData
          );
        ***REMOVED***)
      );
    ***REMOVED*** catch (err) ***REMOVED***
      console.log(
        "Problem occurred trying to post job closure to telegram channels"
      );
    ***REMOVED***
  ***REMOVED***

  if (!!telegramMessageId) ***REMOVED***
    try ***REMOVED***
      await postCloseJobToTelegram(
        process.env.TELEGRAM_CHANNEL_USERNAME,
        telegramMessageId,
        jobData
      );
    ***REMOVED*** catch (err) ***REMOVED***
      console.log(
        "Problem occurred trying to post job closure to telegram channel"
      );
    ***REMOVED***
  ***REMOVED***

  try ***REMOVED***
    await postCloseJobToFacebook(facebookPostId, jobData);
  ***REMOVED*** catch (err) ***REMOVED***
    console.log("Problem occurred trying to post job closure to facebook");
  ***REMOVED***
***REMOVED***;

exports.createJobMessage = createJobMessage;
exports.sendPostToTelegram = sendPostToTelegram;
exports.sendPostToFacebook = sendPostToFacebook;
exports.postCloseJobToFacebook = postCloseJobToFacebook;
exports.postCloseJobToTelegram = postCloseJobToTelegram;
