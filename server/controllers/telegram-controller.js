const { Machine, State, assign, interpret } = require("xstate");
const telegramBot = require("../../lib/telegram_bot");
const redis = require("../redis");
const db = require("../db");
const utils = require("../utils/index");

const MESSAGE_POST_JOB = "📝 Post a Job";
const MESSAGE_BACK_TO_MAIN_MENU = "🔙 Main Menu";

const machine = Machine(
  {
    id: "telegramBotMachine",
    initial: "promptMainMenu",
    context: {
      telegramUserId: null
    },
    states: {
      promptMainMenu: {
        invoke: {
          id: "promptMainMenu",
          src: "promptMainMenu",
          onDone: {
            target: "waitingMainReply"
          }
        }
      },
      waitingMainReply: {
        on: {
          RECEIVED_UPDATE: [
            {
              cond: "isEventPostJob",
              target: "postingJob"
            }
          ]
        }
      },
      postingJob: {
        on: {
          RECEIVED_UPDATE: [
            {
              cond: "isEventBackToMainMenu",
              target: "promptMainMenu"
            }
          ]
        },
        initial: "promptTitle",
        states: {
          promptTitle: {
            invoke: {
              id: "promptTitle",
              src: "promptTitle",
              onDone: {
                target: "waitingTitle"
              }
            }
          },
          waitingTitle: {
            on: {
              RECEIVED_UPDATE: {
                target: "promptJobType",
                actions: ["saveTitle"],
                cond: { type: "titleValid" }
              }
            }
          },
          promptJobType: {
            invoke: {
              id: "promptJobType",
              src: "promptJobType",
              onDone: {
                target: "waitingJobType"
              }
            }
          },
          waitingJobType: {
            on: {
              RECEIVED_UPDATE: {
                target: "promptCareerLevel",
                cond: { type: "jobTypeValid" },
                actions: "saveJobType"
              }
            }
          },
          promptCareerLevel: {}
        }
      }
    }
  },
  {
    guards: {
      isEventPostJob: (context, event) => {
        return (
          event.update &&
          event.update.message &&
          event.update.message.text === MESSAGE_POST_JOB
        );
      },
      isEventBackToMainMenu: (context, event) => {
        return (
          event.update &&
          event.update.message &&
          event.update.message.text === MESSAGE_BACK_TO_MAIN_MENU
        );
      },
      titleValid: (context, event) => {
        const message = event.update && event.update.message;
        return message.text && message.text.length > 0;
      },
      jobTypeValid: (context, event) => {
        const message = event.update && event.update.message;
        return message.text && message.text.length > 0;
      }
    },
    actions: {
      saveTitle: assign({
        jobPosition: (context, event) => event.text
      }),
      saveJobType: assign({
        jobType: (context, event) => event.text
      })
    },
    services: {
      promptMainMenu: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          "Choose an option",
          {
            replyMarkup: {
              keyboard: [[{ text: MESSAGE_POST_JOB }]]
            }
          }
        );
      },
      promptTitle: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          "Enter the job title",
          {
            replyMarkup: {
              keyboard: [[{ text: MESSAGE_BACK_TO_MAIN_MENU }]]
            }
          }
        );
      },
      promptJobType: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          "Choose Job Type",
          {
            replyMarkup: {
              inline_keyboard: utils.jobTypes.map(jobType => {
                return [
                  {
                    text: jobType,
                    callback_data: jobType
                  }
                ];
              })
            }
          }
        );
      }
    }
  }
);

exports.handleTelegramUpdate = async (req, res) => {
  const update = req.body;
  const telegramUser = telegramBot.userFromIncomingUpdate(update);
  if (!telegramUser) {
    return;
  }
  let botMachine = machine;
  let previousState = await getPersistedState(telegramUser.id);
  let currentState;
  if (previousState) {
    console.log({ previousState: previousState.value });
    currentState = botMachine.resolveState(previousState);
  } else {
    const user = await db.findOrCreateTelegramUser({
      ...telegramUser,
      role: "user"
    });
    botMachine = machine.withContext({
      ...machine.context,
      telegramUserId: telegramUser.id
    });
    currentState = botMachine.initialState;
  }
  const service = interpret(botMachine);
  service.onTransition(state => {
    if (state.changed) {
      persistState(telegramUser.id, state);
    }
  });
  service.start(currentState);
  service.send({ type: "RECEIVED_UPDATE", update });
};

async function getPersistedState(telegramUserId) {
  let rawState = await redis.get(`telegram_user_${telegramUserId}`);
  if (rawState) {
    return State.create(JSON.parse(rawState));
  }
}

async function persistState(telegramUserId, state) {
  return redis.set(
    `telegram_user_${telegramUserId}`,
    JSON.stringify(state),
    "ex",
    60 * 60
  );
}
