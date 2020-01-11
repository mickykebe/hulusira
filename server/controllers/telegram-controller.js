const ***REMOVED*** Machine, State, assign, interpret ***REMOVED*** = require("xstate");
const telegramBot = require("../../lib/telegram_bot");
const redis = require("../redis");
const db = require("../db");
const utils = require("../utils/index");

const MESSAGE_POST_JOB = "📝 Post a Job";
const MESSAGE_BACK_TO_MAIN_MENU = "🔙 Main Menu";

const machine = Machine(
  ***REMOVED***
    id: "telegramBotMachine",
    initial: "promptMainMenu",
    context: ***REMOVED***
      telegramUserId: null
    ***REMOVED***,
    states: ***REMOVED***
      promptMainMenu: ***REMOVED***
        invoke: ***REMOVED***
          id: "promptMainMenu",
          src: "promptMainMenu",
          onDone: ***REMOVED***
            target: "waitingMainReply"
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***,
      waitingMainReply: ***REMOVED***
        on: ***REMOVED***
          RECEIVED_UPDATE: [
            ***REMOVED***
              cond: "isEventPostJob",
              target: "postingJob"
            ***REMOVED***
          ]
        ***REMOVED***
      ***REMOVED***,
      postingJob: ***REMOVED***
        on: ***REMOVED***
          RECEIVED_UPDATE: [
            ***REMOVED***
              cond: "isEventBackToMainMenu",
              target: "promptMainMenu"
            ***REMOVED***
          ]
        ***REMOVED***,
        initial: "promptTitle",
        states: ***REMOVED***
          promptTitle: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptTitle",
              src: "promptTitle",
              onDone: ***REMOVED***
                target: "waitingTitle"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingTitle: ***REMOVED***
            on: ***REMOVED***
              RECEIVED_UPDATE: ***REMOVED***
                target: "promptJobType",
                actions: ["saveTitle"],
                cond: ***REMOVED*** type: "titleValid" ***REMOVED***
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          promptJobType: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptJobType",
              src: "promptJobType",
              onDone: ***REMOVED***
                target: "waitingJobType"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingJobType: ***REMOVED***
            on: ***REMOVED***
              RECEIVED_UPDATE: ***REMOVED***
                target: "promptCareerLevel",
                cond: ***REMOVED*** type: "jobTypeValid" ***REMOVED***,
                actions: "saveJobType"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          promptCareerLevel: ***REMOVED******REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***,
  ***REMOVED***
    guards: ***REMOVED***
      isEventPostJob: (context, event) => ***REMOVED***
        return (
          event.update &&
          event.update.message &&
          event.update.message.text === MESSAGE_POST_JOB
        );
      ***REMOVED***,
      isEventBackToMainMenu: (context, event) => ***REMOVED***
        return (
          event.update &&
          event.update.message &&
          event.update.message.text === MESSAGE_BACK_TO_MAIN_MENU
        );
      ***REMOVED***,
      titleValid: (context, event) => ***REMOVED***
        const message = event.update && event.update.message;
        return message.text && message.text.length > 0;
      ***REMOVED***,
      jobTypeValid: (context, event) => ***REMOVED***
        const message = event.update && event.update.message;
        return message.text && message.text.length > 0;
      ***REMOVED***
    ***REMOVED***,
    actions: ***REMOVED***
      saveTitle: assign(***REMOVED***
        jobPosition: (context, event) => event.text
      ***REMOVED***),
      saveJobType: assign(***REMOVED***
        jobType: (context, event) => event.text
      ***REMOVED***)
    ***REMOVED***,
    services: ***REMOVED***
      promptMainMenu: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          "Choose an option",
          ***REMOVED***
            replyMarkup: ***REMOVED***
              keyboard: [[***REMOVED*** text: MESSAGE_POST_JOB ***REMOVED***]]
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptTitle: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          "Enter the job title",
          ***REMOVED***
            replyMarkup: ***REMOVED***
              keyboard: [[***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]]
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptJobType: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          "Choose Job Type",
          ***REMOVED***
            replyMarkup: ***REMOVED***
              inline_keyboard: utils.jobTypes.map(jobType => ***REMOVED***
                return [
                  ***REMOVED***
                    text: jobType,
                    callback_data: jobType
                  ***REMOVED***
                ];
              ***REMOVED***)
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
);

exports.handleTelegramUpdate = async (req, res) => ***REMOVED***
  const update = req.body;
  const telegramUser = telegramBot.userFromIncomingUpdate(update);
  if (!telegramUser) ***REMOVED***
    return;
  ***REMOVED***
  let botMachine = machine;
  let previousState = await getPersistedState(telegramUser.id);
  let currentState;
  if (previousState) ***REMOVED***
    console.log(***REMOVED*** previousState: previousState.value ***REMOVED***);
    currentState = botMachine.resolveState(previousState);
  ***REMOVED*** else ***REMOVED***
    const user = await db.findOrCreateTelegramUser(***REMOVED***
      ...telegramUser,
      role: "user"
    ***REMOVED***);
    botMachine = machine.withContext(***REMOVED***
      ...machine.context,
      telegramUserId: telegramUser.id
    ***REMOVED***);
    currentState = botMachine.initialState;
  ***REMOVED***
  const service = interpret(botMachine);
  service.onTransition(state => ***REMOVED***
    if (state.changed) ***REMOVED***
      persistState(telegramUser.id, state);
    ***REMOVED***
  ***REMOVED***);
  service.start(currentState);
  service.send(***REMOVED*** type: "RECEIVED_UPDATE", update ***REMOVED***);
***REMOVED***;

async function getPersistedState(telegramUserId) ***REMOVED***
  let rawState = await redis.get(`telegram_user_$***REMOVED***telegramUserId***REMOVED***`);
  if (rawState) ***REMOVED***
    return State.create(JSON.parse(rawState));
  ***REMOVED***
***REMOVED***

async function persistState(telegramUserId, state) ***REMOVED***
  return redis.set(
    `telegram_user_$***REMOVED***telegramUserId***REMOVED***`,
    JSON.stringify(state),
    "ex",
    60 * 60
  );
***REMOVED***
