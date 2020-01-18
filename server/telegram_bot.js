const axios = require("axios");

const TELEGRAM_API_BASE_URL = `https://api.telegram.org/bot$***REMOVED***process.env.TELEGRAM_BOT_TOKEN***REMOVED***`;

exports.setupWebhook = function() ***REMOVED***
  return axios.post(`$***REMOVED***TELEGRAM_API_BASE_URL***REMOVED***/setWebhook`, ***REMOVED***
    url: `$***REMOVED***process.env.ROOT_URL***REMOVED***/api/telegram/$***REMOVED***process.env.TELEGRAM_BOT_TOKEN***REMOVED***`
  ***REMOVED***);
***REMOVED***;

exports.sendMessage = function(chatId, text, ***REMOVED*** replyMarkup, parseMode ***REMOVED*** = ***REMOVED******REMOVED***) ***REMOVED***
  return axios.post(`$***REMOVED***TELEGRAM_API_BASE_URL***REMOVED***/sendMessage`, ***REMOVED***
    chat_id: chatId,
    text,
    reply_markup: replyMarkup,
    parse_mode: parseMode
  ***REMOVED***);
***REMOVED***;

exports.answerCallbackQuery = function(
  callbackQueryId,
  ***REMOVED*** text, showAlert = false ***REMOVED*** = ***REMOVED******REMOVED***
) ***REMOVED***
  return axios.post(`$***REMOVED***TELEGRAM_API_BASE_URL***REMOVED***/answerCallbackQuery`, ***REMOVED***
    callback_query_id: callbackQueryId,
    text,
    show_alert: showAlert
  ***REMOVED***);
***REMOVED***;

exports.userFromIncomingUpdate = function(update) ***REMOVED***
  if (update.message) ***REMOVED***
    return update.message.from;
  ***REMOVED***
  if (update.callback_query) ***REMOVED***
    return update.callback_query.from;
  ***REMOVED***
***REMOVED***;
