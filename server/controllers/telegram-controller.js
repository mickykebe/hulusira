const { Machine, State, assign, interpret } = require("xstate");
const _ = require("lodash");
const telegramBot = require("../telegram_bot");
const redis = require("../redis");
const db = require("../db");
const utils = require("../utils/index");
const validation = require("../utils/validation");
const jobHandler = require("../handlers/jobHandler");

const MESSAGE_POST_JOB = "📝 Post a Job";
const MESSAGE_START = "/start";
const MESSAGE_BACK_TO_MAIN_MENU = "🔚 Main Menu";
const MESSAGE_BACK = "⬅️ Back";
const MESSAGE_SKIP = "➡️ Skip";
const MESSAGE_APPLY_EMAIL = "📧 Apply via Email";
const MESSAGE_APPLY_URL = "🔗 Apply via URL";
const MESSAGE_YES = "✅ Yes";
const MESSAGE_NO = "❌ No";
const MESSAGE_ADD_COMPANY = "🏢 Add Company";
const MESSAGE_RETRY = "🔄 Retry";

const EVENT_START = "START";
const EVENT_BACK_TO_MAIN_MENU = "BACK_TO_MAIN_MENU";

const checkTelegramMessageEvent = MESSAGE => (context, event) => {
  return (
    event.update &&
    event.update.message &&
    event.update.message.text === MESSAGE
  );
};

const resetContextField = field =>
  assign({
    [field]: (context, event) => undefined
  });

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
          [EVENT_START]: {
            target: "promptMainMenu"
          },
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
          [EVENT_START]: {
            target: "promptMainMenu"
          },
          [EVENT_BACK_TO_MAIN_MENU]: {
            target: "promptMainMenu"
          }
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
            entry: ["resetTitle"],
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
            entry: ["resetJobType"],
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: "isEventBack",
                  target: "promptTitle"
                },
                {
                  target: "promptCareerLevel",
                  cond: { type: "jobTypeValid" },
                  actions: "saveJobType"
                }
              ]
            }
          },
          promptCareerLevel: {
            invoke: {
              id: "promptCareerLevel",
              src: "promptCareerLevel",
              onDone: {
                target: "waitingCareerLevel"
              }
            }
          },
          waitingCareerLevel: {
            entry: ["resetCareerLevel"],
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: "isEventBack",
                  target: "promptJobType"
                },
                {
                  target: "promptLocation",
                  cond: { type: "careerLevelValid" },
                  actions: "saveCareerLevel"
                }
              ]
            }
          },
          promptLocation: {
            invoke: {
              id: "promptLocation",
              src: "promptLocation",
              onDone: {
                target: "waitingLocation"
              }
            }
          },
          waitingLocation: {
            entry: ["resetLocation"],
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: { type: "isEventSkip" },
                  target: "promptTags"
                },
                {
                  cond: "isEventBack",
                  target: "promptCareerLevel"
                },
                {
                  target: "promptTags",
                  actions: "saveLocation"
                }
              ]
            }
          },
          promptTags: {
            invoke: {
              id: "promptTags",
              src: "promptTags",
              onDone: {
                target: "waitingTags"
              }
            }
          },
          waitingTags: {
            entry: ["resetTags"],
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: "isEventBack",
                  target: "promptLocation"
                },
                {
                  cond: { type: "tagsValid" },
                  target: "promptSalary",
                  actions: "saveTags"
                }
              ]
            }
          },
          promptSalary: {
            invoke: {
              id: "promptSalary",
              src: "promptSalary",
              onDone: {
                target: "waitingSalary"
              }
            }
          },
          waitingSalary: {
            entry: ["resetSalary"],
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: "isEventBack",
                  target: "promptTags"
                },
                {
                  cond: { type: "isEventSkip" },
                  target: "promptDeadline"
                },
                {
                  target: "promptDeadline",
                  actions: "saveSalary"
                }
              ]
            }
          },
          promptDeadline: {
            invoke: {
              id: "promptDeadline",
              src: "promptDeadline",
              onDone: {
                target: "waitingDeadline"
              }
            }
          },
          waitingDeadline: {
            entry: ["resetDeadline"],
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: "isEventBack",
                  target: "promptSalary"
                },
                {
                  cond: { type: "isEventSkip" },
                  target: "promptDescription"
                },
                {
                  cond: { type: "deadlineValid" },
                  target: "promptDescription",
                  actions: "saveDeadline"
                }
              ]
            }
          },
          promptDescription: {
            invoke: {
              id: "promptDescription",
              src: "promptDescription",
              onDone: {
                target: "waitingDescription"
              }
            }
          },
          waitingDescription: {
            entry: ["resetDescription"],
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: "isEventBack",
                  target: "promptDeadline"
                },
                {
                  target: "promptRequirements",
                  actions: "saveDescription",
                  cond: { type: "descriptionValid" }
                }
              ]
            }
          },
          promptRequirements: {
            invoke: {
              id: "promptRequirements",
              src: "promptRequirements",
              onDone: {
                target: "waitingRequirements"
              }
            }
          },
          waitingRequirements: {
            entry: ["resetRequirements"],
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: "isEventBack",
                  target: "promptDescription"
                },
                {
                  cond: { type: "isEventSkip" },
                  target: "promptResponsibilities"
                },
                {
                  target: "promptResponsibilities",
                  actions: "saveRequirements"
                }
              ]
            }
          },
          promptResponsibilities: {
            invoke: {
              id: "promptResponsibilities",
              src: "promptResponsibilities",
              onDone: {
                target: "waitingResponsibilities"
              }
            }
          },
          waitingResponsibilities: {
            entry: ["resetResponsibilities"],
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: "isEventBack",
                  target: "promptRequirements"
                },
                {
                  cond: { type: "isEventSkip" },
                  target: "promptHowToApply"
                },
                {
                  target: "promptHowToApply",
                  actions: "saveResponsibilities"
                }
              ]
            }
          },
          promptHowToApply: {
            invoke: {
              id: "promptHowToApply",
              src: "promptHowToApply",
              onDone: {
                target: "waitingHowToApply"
              }
            }
          },
          waitingHowToApply: {
            entry: ["resetHowToApply"],
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: "isEventBack",
                  target: "promptResponsibilities"
                },
                {
                  cond: { type: "isEventSkip" },
                  target: "promptApplyMethodChoice"
                },
                {
                  target: "promptApplyMethodChoice",
                  actions: "saveHowToApply"
                }
              ]
            }
          },
          promptApplyMethodChoice: {
            invoke: {
              id: "promptApplyMethodChoice",
              src: "promptApplyMethodChoice",
              onDone: {
                target: "waitingForApplyMethodChoice"
              }
            }
          },
          waitingForApplyMethodChoice: {
            entry: ["resetApplyUrl", "resetApplyEmail"],
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: "isEventBack",
                  target: "promptHowToApply"
                },
                {
                  cond: { type: "isEventSkip" },
                  target: "promptIsCompanyJob"
                },
                {
                  cond: { type: "isEventApplyEmail" },
                  target: "promptApplyEmail"
                },
                {
                  cond: { type: "isEventApplyUrl" },
                  target: "promptApplyUrl"
                }
              ]
            }
          },
          promptApplyEmail: {
            invoke: {
              id: "promptApplyEmail",
              src: "promptApplyEmail",
              onDone: {
                target: "waitingApplyEmail"
              }
            }
          },
          waitingApplyEmail: {
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: "isEventBack",
                  target: "promptApplyMethodChoice"
                },
                {
                  cond: { type: "applyEmailValid" },
                  target: "promptIsCompanyJob",
                  actions: "saveApplyEmail"
                }
              ]
            }
          },
          promptApplyUrl: {
            invoke: {
              id: "promptApplyUrl",
              src: "promptApplyUrl",
              onDone: {
                target: "waitingApplyUrl"
              }
            }
          },
          waitingApplyUrl: {
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: "isEventBack",
                  target: "promptApplyMethodChoice"
                },
                {
                  target: "promptIsCompanyJob",
                  actions: "saveApplyUrl"
                }
              ]
            }
          },
          promptIsCompanyJob: {
            invoke: {
              id: "promptIsCompanyJob",
              src: "promptIsCompanyJob",
              onDone: {
                target: "waitingIsCompanyJob"
              }
            }
          },
          waitingIsCompanyJob: {
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: "isEventBack",
                  target: "promptApplyMethodChoice"
                },
                {
                  cond: "isEventYes",
                  target: "getUserCompanies"
                },
                {
                  cond: "isEventNo",
                  target: "savingJob"
                }
              ]
            }
          },
          getUserCompanies: {
            invoke: {
              id: "getUserCompanies",
              src: "getUserCompanies",
              onDone: [
                {
                  cond: "userHasCompanies",
                  target: "promptChooseCompany",
                  actions: "saveMyCompanies"
                },
                {
                  target: "promptCompanyName"
                }
              ]
            }
          },
          promptChooseCompany: {
            invoke: {
              id: "promptChooseCompany",
              src: "promptChooseCompany",
              onDone: {
                target: "waitingCompanyChoice"
              }
            }
          },
          waitingCompanyChoice: {
            entry: ["resetCompanyId"],
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: "isEventBack",
                  target: "promptIsCompanyJob"
                },
                {
                  cond: "isEventAddCompany",
                  target: "promptCompanyName"
                },
                {
                  cond: "chosenCompanyValid",
                  target: "savingJob",
                  actions: "saveCompanyId"
                }
              ]
            }
          },
          promptCompanyName: {
            invoke: {
              id: "promptCompanyName",
              src: "promptCompanyName",
              onDone: {
                target: "waitingCompanyName"
              }
            }
          },
          waitingCompanyName: {
            entry: ["resetCompanyName"],
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: "isEventBack",
                  target: "promptIsCompanyJob"
                },
                {
                  cond: "companyNameValid",
                  target: "promptCompanyEmail",
                  actions: "saveCompanyName"
                }
              ]
            }
          },
          promptCompanyEmail: {
            invoke: {
              id: "promptCompanyEmail",
              src: "promptCompanyEmail",
              onDone: {
                target: "waitingCompanyEmail"
              }
            }
          },
          waitingCompanyEmail: {
            entry: ["resetCompanyEmail"],
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: "isEventBack",
                  target: "promptCompanyName"
                },
                {
                  cond: "companyEmailValid",
                  target: "savingJob",
                  actions: "saveCompanyEmail"
                }
              ]
            }
          },
          savingJob: {
            invoke: {
              id: "saveJob",
              src: "saveJob",
              onDone: {
                target: "#telegramBotMachine.promptMainMenu"
              },
              onError: {
                target: "errorSavingJob"
              }
            }
          },
          errorSavingJob: {
            invoke: {
              id: "errorSavingJob",
              src: "promptErrorSavingJob",
              onDone: {
                target: "waitingErrorSavingJobReply"
              }
            }
          },
          waitingErrorSavingJobReply: {
            on: {
              RECEIVED_UPDATE: [
                {
                  cond: "isEventBack",
                  target: "promptIsCompanyJob"
                },
                {
                  cond: "isEventRetry",
                  target: "savingJob"
                }
              ]
            }
          }
        }
      }
    }
  },
  {
    guards: {
      isEventBack: checkTelegramMessageEvent(MESSAGE_BACK),
      isEventPostJob: checkTelegramMessageEvent(MESSAGE_POST_JOB),
      isEventSkip: checkTelegramMessageEvent(MESSAGE_SKIP),
      isEventApplyEmail: checkTelegramMessageEvent(MESSAGE_APPLY_EMAIL),
      isEventApplyUrl: checkTelegramMessageEvent(MESSAGE_APPLY_URL),
      isEventYes: checkTelegramMessageEvent(MESSAGE_YES),
      isEventNo: checkTelegramMessageEvent(MESSAGE_NO),
      isEventAddCompany: checkTelegramMessageEvent(MESSAGE_ADD_COMPANY),
      isEventRetry: checkTelegramMessageEvent(MESSAGE_RETRY),
      titleValid: (context, event) => {
        const message = event.update && event.update.message;
        return validation.positionValidator.isValidSync(message.text);
      },
      jobTypeValid: (context, event) => {
        const message = event.update && event.update.message;
        return validation.jobTypeValidator.isValidSync(message.text);
      },
      careerLevelValid: (context, event) => {
        const message = event.update && event.update.message;
        const level = utils.careerLevels.find(
          level => level.label === message.text
        );
        console.log({ level });
        return !!level && validation.careerLevelValidator.isValidSync(level.id);
      },
      tagsValid: (context, event) => {
        const message = event.update && event.update.message;
        const tags = utils.parseTags(message.text);
        return tags.length > 0;
      },
      deadlineValid: (context, event) => {
        const message = event.update && event.update.message;
        return validation.deadlineValidator.isValidSync(message.text);
      },
      descriptionValid: (context, event) => {
        const message = event.update && event.update.message;
        return validation.descriptionValidator.isValidSync(message.text);
      },
      applyEmailValid: (context, event) => {
        const message = event.update && event.update.message;
        return validation.applyEmailValidator.isValidSync(message.text);
      },
      userHasCompanies: (context, event) => {
        const companies = event.data;
        return companies.length > 0;
      },
      chosenCompanyValid: (context, event) => {
        const message = event.update && event.update.message;
        const companyId = parseInt(message.text.split("-")[0]);
        return (
          context.companies.findIndex(company => company.id === companyId) !==
          -1
        );
      },
      companyNameValid: (context, event) => {
        const message = event.update && event.update.message;
        return validation.companyNameValidator.isValidSync(message.text);
      },
      companyEmailValid: (context, event) => {
        const message = event.update && event.update.message;
        return validation.companyEmailValidator.isValidSync(message.text);
      }
    },
    actions: {
      saveTitle: assign({
        position: (context, event) => event.update.message.text
      }),
      resetTitle: resetContextField("position"),
      saveJobType: assign({
        jobType: (context, event) => event.update.message.text
      }),
      resetJobType: resetContextField("jobType"),
      saveCareerLevel: assign({
        careerLevel: (context, event) => {
          const level = utils.careerLevels.find(
            level => level.label === event.update.message.text
          );
          return level && level.id;
        }
      }),
      resetCareerLevel: resetContextField("careerLevel"),
      saveLocation: assign({
        location: (context, event) => event.update.message.text
      }),
      resetLocation: resetContextField("location"),
      saveTags: assign({
        tags: (context, event) => utils.parseTags(event.update.message.text)
      }),
      resetTags: resetContextField("tags"),
      saveSalary: assign({
        salary: (context, event) => event.update.message.text
      }),
      resetSalary: resetContextField("salary"),
      saveDeadline: assign({
        deadline: (context, event) => event.update.message.text
      }),
      resetDeadline: resetContextField("deadline"),
      saveDescription: assign({
        description: (context, event) => event.update.message.text
      }),
      resetDescription: resetContextField("description"),
      saveRequirements: assign({
        requirements: (context, event) => event.update.message.text
      }),
      resetRequirements: resetContextField("requirements"),
      saveResponsibilities: assign({
        responsibilities: (context, event) => event.update.message.text
      }),
      resetResponsibilities: resetContextField("responsibilities"),
      saveHowToApply: assign({
        howToApply: (context, event) => event.update.message.text
      }),
      resetHowToApply: resetContextField("howToApply"),
      saveApplyEmail: assign({
        applyEmail: (context, event) => event.update.message.text
      }),
      resetApplyEmail: resetContextField("applyEmail"),
      saveApplyUrl: assign({
        applyUrl: (context, event) => event.update.message.text
      }),
      resetApplyUrl: resetContextField("applyUrl"),
      saveMyCompanies: assign({
        companies: (context, event) => event.data
      }),
      resetCompanies: resetContextField("companies"),
      saveCompanyId: assign({
        companyId: (context, event) => {
          return parseInt(event.update.message.text.split("-")[0]);
        }
      }),
      resetCompanyId: resetContextField("companyId"),
      saveCompanyName: assign({
        companyName: (context, event) => event.update.message.text
      }),
      resetCompanyName: resetContextField("companyName"),
      saveCompanyEmail: assign({
        companyEmail: (context, event) => event.update.message.text
      }),
      resetCompanyEmail: resetContextField("companyEmail")
    },
    services: {
      promptMainMenu: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          "Choose an option",
          {
            replyMarkup: {
              keyboard: [[{ text: MESSAGE_POST_JOB }]],
              resize_keyboard: true
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
              keyboard: [[{ text: MESSAGE_BACK_TO_MAIN_MENU }]],
              resize_keyboard: true
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
              keyboard: _.chunk(
                utils.jobTypes.map(jobType => ({ text: jobType })),
                3
              ).concat([
                [{ text: MESSAGE_BACK }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ]),
              resize_keyboard: true
            }
          }
        );
      },
      promptCareerLevel: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          "Choose the job's required level of experience",
          {
            replyMarkup: {
              keyboard: _.chunk(
                utils.careerLevels.map(careerLevel => ({
                  text: careerLevel.label
                })),
                1
              ).concat([
                [{ text: MESSAGE_BACK }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ]),
              resize_keyboard: true
            }
          }
        );
      },
      promptLocation: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          "Enter job location",
          {
            replyMarkup: {
              keyboard: [
                [{ text: MESSAGE_BACK }, { text: MESSAGE_SKIP }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ],
              resize_keyboard: true
            }
          }
        );
      },
      promptTags: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Please enter some tags(at least one) that describe the job(separated by comma)
          
E.g. Accounting, NGO, Information Technology, Driver, Messenger etc.`,
          {
            replyMarkup: {
              keyboard: [
                [{ text: MESSAGE_BACK }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ],
              resize_keyboard: true
            }
          }
        );
      },
      promptSalary: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter Salary
          
_(Salary is not required, but recommended for better job visibility)_`,
          {
            parseMode: "Markdown",
            replyMarkup: {
              keyboard: [
                [{ text: MESSAGE_BACK }, { text: MESSAGE_SKIP }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ],
              resize_keyboard: true
            }
          }
        );
      },
      promptDeadline: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter Application Deadline
          
_(Format YYYY-MM-DD E.g. 2020-02-23)_`,
          {
            parseMode: "Markdown",
            replyMarkup: {
              keyboard: [
                [{ text: MESSAGE_BACK }, { text: MESSAGE_SKIP }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ],
              resize_keyboard: true
            }
          }
        );
      },
      promptDescription: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter Job Description
          
(Supports [Markdown](https://www.markdownguide.org/basic-syntax/))`,
          {
            parseMode: "Markdown",
            replyMarkup: {
              keyboard: [
                [{ text: MESSAGE_BACK }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ],
              resize_keyboard: true
            }
          }
        );
      },
      promptRequirements: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter Job Requirements
          
(Supports [Markdown](https://www.markdownguide.org/basic-syntax/))`,
          {
            parseMode: "Markdown",
            replyMarkup: {
              keyboard: [
                [{ text: MESSAGE_BACK }, { text: MESSAGE_SKIP }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ],
              resize_keyboard: true
            }
          }
        );
      },
      promptResponsibilities: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter Job Responsibilities
          
(Supports [Markdown](https://www.markdownguide.org/basic-syntax/))`,
          {
            parseMode: "Markdown",
            replyMarkup: {
              keyboard: [
                [{ text: MESSAGE_BACK }, { text: MESSAGE_SKIP }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ],
              resize_keyboard: true
            }
          }
        );
      },
      promptHowToApply: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter instructions for interested applicants on how they can apply for the job.
          
(Supports [Markdown](https://www.markdownguide.org/basic-syntax/))`,
          {
            parseMode: "Markdown",
            replyMarkup: {
              keyboard: [
                [{ text: MESSAGE_BACK }, { text: MESSAGE_SKIP }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ],
              resize_keyboard: true
            }
          }
        );
      },
      promptApplyMethodChoice: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Allow candidates to apply via email or throgh a custom url?`,
          {
            replyMarkup: {
              keyboard: [
                [{ text: MESSAGE_APPLY_EMAIL }, { text: MESSAGE_APPLY_URL }],
                [{ text: MESSAGE_BACK }, { text: MESSAGE_SKIP }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ],
              resize_keyboard: true
            }
          }
        );
      },
      promptApplyEmail: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter the email address where interested candidates can apply to`,
          {
            replyMarkup: {
              keyboard: [
                [{ text: MESSAGE_BACK }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ],
              resize_keyboard: true
            }
          }
        );
      },
      promptApplyUrl: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter the application url where interested candidates can apply to`,
          {
            replyMarkup: {
              keyboard: [
                [{ text: MESSAGE_BACK }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ],
              resize_keyboard: true
            }
          }
        );
      },
      promptIsCompanyJob: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Is this job at a company/organization`,
          {
            replyMarkup: {
              keyboard: [
                [{ text: MESSAGE_YES }, { text: MESSAGE_NO }],
                [{ text: MESSAGE_BACK }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ],
              resize_keyboard: true
            }
          }
        );
      },
      getUserCompanies: async context => {
        if (!context.userId) {
          throw new Error("User not found");
        }
        const companies = await db.getCompanies(parseInt(context.userId));
        return companies;
      },
      promptChooseCompany: async context => {
        const companies = await db.getCompanies(parseInt(context.userId));
        console.log({ companies });
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Choose a company for this job`,
          {
            replyMarkup: {
              keyboard: [
                ...companies.map(company => {
                  return [{ text: `${company.id}-${company.name}` }];
                }),
                [{ text: MESSAGE_ADD_COMPANY }],
                [{ text: MESSAGE_BACK }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ],
              resize_keyboard: true
            }
          }
        );
      },
      promptCompanyName: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter Company Name`,
          {
            replyMarkup: {
              keyboard: [
                [{ text: MESSAGE_BACK }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ],
              resize_keyboard: true
            }
          }
        );
      },
      promptCompanyEmail: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter Company Email Address
          
_(Email is kept strictly confidential. Job applicants won't be able to see your company email)_`,
          {
            parseMode: "Markdown",
            replyMarkup: {
              keyboard: [
                [{ text: MESSAGE_BACK }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ],
              resize_keyboard: true
            }
          }
        );
      },
      saveJob: async context => {
        try {
          const user = await db.getUserById(context.userId);
          const data = await jobHandler.createJob(user, context);
          await telegramBot.sendMessage(
            context.telegramUserId,
            `🎉🎉🎉Job Successfully Created🎉🎉🎉. ${data.job.approvalStatus ===
              "Pending" && `It will be live once it gets admin approval.`}
              
You'll be notified once your job is live.`
          );
        } catch (err) {
          console.log(err);
          throw err;
        }
      },
      promptErrorSavingJob: async context => {
        await telegramBot.sendMessage(
          context.telegramUserId,
          `🙈 Failed trying to save job. Press retry to try again. 😰`,
          {
            replyMarkup: {
              keyboard: [
                [{ text: MESSAGE_RETRY }],
                [{ text: MESSAGE_BACK }],
                [{ text: MESSAGE_BACK_TO_MAIN_MENU }]
              ],
              resize_keyboard: true
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
    currentState = botMachine.resolveState(previousState);
  } else {
    const user = await db.findOrCreateTelegramUser({
      ...telegramUser,
      role: "user"
    });
    botMachine = machine.withContext({
      ...machine.context,
      userId: user.id,
      telegramUserId: telegramUser.id
    });
    currentState = botMachine.initialState;
  }
  const service = interpret(botMachine);
  service.onTransition(state => {
    if (state.changed) {
      console.log({ currentState: state.value, context: state.context });
      persistState(telegramUser.id, state);
    }
  });
  service.start(currentState);
  if (update.message && update.message.text === MESSAGE_START) {
    service.send({ type: EVENT_START });
  } else if (
    update.message &&
    update.message.text === MESSAGE_BACK_TO_MAIN_MENU
  ) {
    service.send({ type: EVENT_BACK_TO_MAIN_MENU });
  } else {
    service.send({ type: "RECEIVED_UPDATE", update });
  }
  res.sendStatus(200);
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
    6 * 60 * 60
  );
}
