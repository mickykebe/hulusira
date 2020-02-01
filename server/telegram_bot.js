const axios = require("axios");

const TELEGRAM_API_BASE_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

exports.setupWebhook = function() {
  return axios.post(`${TELEGRAM_API_BASE_URL}/setWebhook`, {
    url: `${process.env.ROOT_URL}/api/telegram/${process.env.TELEGRAM_BOT_TOKEN}`
  });
};

exports.sendMessage = function(chatId, text, { replyMarkup, parseMode } = {}) {
  return axios.post(`${TELEGRAM_API_BASE_URL}/sendMessage`, {
    chat_id: chatId,
    text,
    reply_markup: replyMarkup,
    parse_mode: parseMode
  });
};

exports.answerCallbackQuery = function(
  callbackQueryId,
  { text, showAlert = false } = {}
) {
  return axios.post(`${TELEGRAM_API_BASE_URL}/answerCallbackQuery`, {
    callback_query_id: callbackQueryId,
    text,
    show_alert: showAlert
  });
};

exports.userFromIncomingUpdate = function(update) {
  if (update.message) {
    return update.message.from;
  }
  if (update.callback_query) {
    return update.callback_query.from;
  }
};
