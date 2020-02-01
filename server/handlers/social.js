const axios = require("axios");
const db = require("../db");
const { logAxiosErrors, careerLevelLabel } = require("../utils");
const format = require("date-fns/format");

const TELEGRAM_API_BASE_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

const createJobMessage = ({ job, company }) => {
  return `💼 ${job.position}

🕔 ${job.jobType}${company ? `\n\n🏢 ${company.name}` : ""}${
    job.careerLevel ? `\n\n📈 ${careerLevelLabel(job.careerLevel)}` : ""
  }${job.location ? `\n\n📍 ${job.location}` : ""}${
    job.salary ? `\n\n💰 ${job.salary}` : ""
  }${
    job.deadline
      ? `\n\n⏳ Deadline: ${format(new Date(job.deadline), "MMM dd, yyyy")}`
      : ""
  }
  
📋 ${job.description}
${job.tags.map(tag => `#${tag.name.replace(/\s+/g, "_")}`).join(" ")}`;
};

const sendPostToFacebook = async function(
  message,
  jobUrl,
  { scheduleTime } = {}
) {
  let fbPostId;
  const encodedMessage = encodeURIComponent(message);
  const encodedJobUrl = encodeURIComponent(jobUrl);
  try {
    const { data: response } = await axios
      .post(
        `https://graph.facebook.com/${process.env.FB_PAGE_ID}/feed?message=${encodedMessage}&link=${encodedJobUrl}&access_token=${process.env.FB_PAGE_ACCESS_TOKEN}`
      )
      .catch(logAxiosErrors);
    if (response.id) {
      fbPostId = response.id;
    }
    if (scheduleTime) {
      const shareablePages = JSON.parse(process.env.SHARING_FB_PAGES) || [];
      await Promise.all(
        shareablePages.map((page, index) => {
          //within 30 minutes of each other
          const time = scheduleTime + index * 1800;
          return axios
            .post(
              `https://graph.facebook.com/${page.id}/feed?message=${encodedMessage}&link=https://www.facebook.com/${fbPostId}&access_token=${page.token}&published=false&scheduled_publish_time=${time}`
            )
            .catch(logAxiosErrors);
        })
      );
    }
  } catch (error) {
    console.log("Problem occurred posting job to facebook");
  } finally {
    return fbPostId;
  }
};

const sendPostToTelegram = async function(channelUsername, message, jobUrl) {
  try {
    const { data: response } = await axios
      .post(`${TELEGRAM_API_BASE_URL}/sendMessage`, {
        chat_id: `@${channelUsername}`,
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

exports.postJobToSocialMedia = async function(jobData, { fbSchedule } = {}) {
  const messageBody = createJobMessage(jobData);
  const jobUrl = `${process.env.ROOT_URL}/jobs/${jobData.job.slug}`;
  const jobFacebookUrl = `${jobUrl}?utm_source=HuluSira%20Facebook%20Page&utm_medium=facebook&utm_campaign=${jobData.job.slug}`;
  const telegramMessage = `${messageBody}
  
Hulusira ላይ ስራ ማስተዋወቅ የሚፈልጉ ቀጣሪዎች @${process.env.TELEGRAM_BOT_NAME} በመጠቀም በነጻ የስራ ማስታወቅያ ማውጣት ይችላሉ፡፡`;
  const facebookMessage = `ክፍት የስራ ቦታ ማስታወቅያ
  
${messageBody}
${jobFacebookUrl}

💬 ትኩስ ስራዎች እንደወጡ እንዲደርስዎ ቴሌግራም ቻናላችንን ተቀላቀሉ፡ https://t.me/joinchat/AAAAAFZnrdEWsYxQugEU3A`;

  let telegramMessages = null;
  const telegramChannelUsernames = (
    process.env.TELEGRAM_CHANNEL_USERNAMES || ""
  )
    .split(" ")
    .filter(userName => !!userName);
  if (telegramChannelUsernames.length > 0) {
    let messageIds = await Promise.all(
      telegramChannelUsernames
        .map(channelUserName => {
          const jobTelegramUrl = `${jobUrl}?utm_source=${encodeURIComponent(
            `${channelUserName} Telegram Channel`
          )}&utm_medium=telegram&utm_campaign=${jobData.job.slug}`;
          return sendPostToTelegram(
            channelUserName,
            telegramMessage,
            jobTelegramUrl
          );
        })
        .map(p => p.catch(() => null))
    );
    const messages = messageIds
      .map((messageId, index) => ({
        channelUserName: telegramChannelUsernames[index],
        messageId
      }))
      .filter(message => message.messageId !== null);
    telegramMessages = JSON.stringify(messages);
  }

  const facebookPostId = await sendPostToFacebook(
    facebookMessage,
    jobFacebookUrl,
    { scheduleTime: fbSchedule }
  ).catch(() => null);
  await db.createJobSocialPost(jobData.job.id, {
    telegramMessages,
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

const postCloseJobToTelegram = async function(
  channelUserName,
  messageId,
  jobData
) {
  if (!messageId) {
    return;
  }

  const closedMessage = `--------- 🔒 JOB CLOSED --------- \n\n\n${createJobMessage(
    jobData
  )}`;

  return axios
    .post(`${TELEGRAM_API_BASE_URL}/editMessageText`, {
      chat_id: `@${channelUserName}`,
      message_id: messageId,
      text: closedMessage
    })
    .catch(logAxiosErrors);
};

exports.postJobCloseToSocialMedia = async function(jobData) {
  const messageIds = await db.getJobSocialPost(jobData.job.id);
  if (!messageIds) {
    return;
  }
  const { telegramMessages, telegramMessageId, facebookPostId } = messageIds;

  if (!!telegramMessages) {
    try {
      await Promise.all(
        telegramMessages.map(message => {
          return postCloseJobToTelegram(
            message.channelUserName,
            message.messageId,
            jobData
          );
        })
      );
    } catch (err) {
      console.log(
        "Problem occurred trying to post job closure to telegram channels"
      );
    }
  }

  if (!!telegramMessageId) {
    try {
      await postCloseJobToTelegram(
        process.env.TELEGRAM_CHANNEL_USERNAME,
        telegramMessageId,
        jobData
      );
    } catch (err) {
      console.log(
        "Problem occurred trying to post job closure to telegram channel"
      );
    }
  }

  try {
    await postCloseJobToFacebook(facebookPostId, jobData);
  } catch (err) {
    console.log("Problem occurred trying to post job closure to facebook");
  }
};

exports.createJobMessage = createJobMessage;
exports.sendPostToTelegram = sendPostToTelegram;
exports.sendPostToFacebook = sendPostToFacebook;
exports.postCloseJobToFacebook = postCloseJobToFacebook;
exports.postCloseJobToTelegram = postCloseJobToTelegram;
