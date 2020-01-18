const ***REMOVED*** Machine, State, assign, interpret ***REMOVED*** = require("xstate");
const _ = require("lodash");
const telegramBot = require("../telegram_bot");
const redis = require("../redis");
const db = require("../db");
const utils = require("../utils/index");
const validation = require("../utils/validation");
const jobHandler = require("../handlers/jobHandler");
const socialHandler = require("../handlers/social");

const MESSAGE_POST_JOB = "📝 Post a Job";
const MESSAGE_MY_JOBS = "🗂️ My Jobs";
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
const MESSAGE_PENDING_JOBS = "⏳ Pending Jobs";
const MESSAGE_ACTIVE_JOBS = "✅ Active Jobs";
const MESSAGE_CLOSED_JOBS = "🚪 Closed Jobs";
const MESSAGE_DECLINED_JOBS = "🚫 Declined Jobs";
const APPROVAL_STATUS_MESSAGES = [
  MESSAGE_PENDING_JOBS,
  MESSAGE_ACTIVE_JOBS,
  MESSAGE_CLOSED_JOBS,
  MESSAGE_DECLINED_JOBS
];
const MESSAGE_APPROVAL_STATUS_MAP = ***REMOVED***
  [MESSAGE_PENDING_JOBS]: "Pending",
  [MESSAGE_ACTIVE_JOBS]: "Active",
  [MESSAGE_CLOSED_JOBS]: "Closed",
  [MESSAGE_DECLINED_JOBS]: "Declined"
***REMOVED***;

const EVENT_START = "START";
const EVENT_BACK_TO_MAIN_MENU = "BACK_TO_MAIN_MENU";
const EVENT_CLOSE_JOB = "CLOSE_JOB";

const checkTelegramMessageEvent = MESSAGE => (context, event) => ***REMOVED***
  return (
    event.update &&
    event.update.message &&
    event.update.message.text === MESSAGE
  );
***REMOVED***;

const resetContextField = field =>
  assign(***REMOVED***
    [field]: (context, event) => undefined
  ***REMOVED***);

const machine = Machine(
  ***REMOVED***
    id: "telegramBotMachine",
    context: ***REMOVED***
      telegramUserId: null
    ***REMOVED***,
    initial: "promptMainMenu",
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
          [EVENT_START]: ***REMOVED***
            target: "promptMainMenu"
          ***REMOVED***,
          RECEIVED_UPDATE: [
            ***REMOVED***
              cond: "isEventPostJob",
              target: "postingJob"
            ***REMOVED***,
            ***REMOVED***
              cond: "isEventMyJobs",
              target: "promptMyJobs"
            ***REMOVED***
          ]
        ***REMOVED***
      ***REMOVED***,
      promptMyJobs: ***REMOVED***
        invoke: ***REMOVED***
          id: "promptMyJobs",
          src: "promptMyJobs",
          onDone: ***REMOVED***
            target: "waitingApprovalStatus"
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***,
      waitingApprovalStatus: ***REMOVED***
        on: ***REMOVED***
          [EVENT_BACK_TO_MAIN_MENU]: ***REMOVED***
            target: "promptMainMenu"
          ***REMOVED***,
          RECEIVED_UPDATE: [
            ***REMOVED***
              cond: "isValidApprovalStatus",
              target: "getMyJobs",
              actions: "setApprovalStatus"
            ***REMOVED***
          ]
        ***REMOVED***
      ***REMOVED***,
      getMyJobs: ***REMOVED***
        invoke: ***REMOVED***
          id: "getMyJobs",
          src: "getMyJobs",
          onDone: ***REMOVED***
            target: "promptMyJobs"
          ***REMOVED***,
          onError: ***REMOVED***
            target: "errorGettingMyJobs"
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***,
      errorGettingMyJobs: ***REMOVED***
        invoke: ***REMOVED***
          id: "errorGettingJobs",
          src: "errorGettingJobs",
          onDone: ***REMOVED***
            target: "promptMyJobs"
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***,
      postingJob: ***REMOVED***
        on: ***REMOVED***
          [EVENT_START]: ***REMOVED***
            target: "promptMainMenu"
          ***REMOVED***,
          [EVENT_BACK_TO_MAIN_MENU]: ***REMOVED***
            target: "promptMainMenu"
          ***REMOVED***
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
            entry: ["resetTitle"],
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
            entry: ["resetJobType"],
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptTitle"
                ***REMOVED***,
                ***REMOVED***
                  target: "promptCareerLevel",
                  cond: ***REMOVED*** type: "jobTypeValid" ***REMOVED***,
                  actions: "saveJobType"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          promptCareerLevel: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptCareerLevel",
              src: "promptCareerLevel",
              onDone: ***REMOVED***
                target: "waitingCareerLevel"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingCareerLevel: ***REMOVED***
            entry: ["resetCareerLevel"],
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptJobType"
                ***REMOVED***,
                ***REMOVED***
                  target: "promptLocation",
                  cond: ***REMOVED*** type: "careerLevelValid" ***REMOVED***,
                  actions: "saveCareerLevel"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          promptLocation: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptLocation",
              src: "promptLocation",
              onDone: ***REMOVED***
                target: "waitingLocation"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingLocation: ***REMOVED***
            entry: ["resetLocation"],
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: ***REMOVED*** type: "isEventSkip" ***REMOVED***,
                  target: "promptTags"
                ***REMOVED***,
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptCareerLevel"
                ***REMOVED***,
                ***REMOVED***
                  target: "promptTags",
                  actions: "saveLocation"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          promptTags: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptTags",
              src: "promptTags",
              onDone: ***REMOVED***
                target: "waitingTags"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingTags: ***REMOVED***
            entry: ["resetTags"],
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptLocation"
                ***REMOVED***,
                ***REMOVED***
                  cond: ***REMOVED*** type: "tagsValid" ***REMOVED***,
                  target: "promptSalary",
                  actions: "saveTags"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          promptSalary: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptSalary",
              src: "promptSalary",
              onDone: ***REMOVED***
                target: "waitingSalary"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingSalary: ***REMOVED***
            entry: ["resetSalary"],
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptTags"
                ***REMOVED***,
                ***REMOVED***
                  cond: ***REMOVED*** type: "isEventSkip" ***REMOVED***,
                  target: "promptDeadline"
                ***REMOVED***,
                ***REMOVED***
                  target: "promptDeadline",
                  actions: "saveSalary"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          promptDeadline: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptDeadline",
              src: "promptDeadline",
              onDone: ***REMOVED***
                target: "waitingDeadline"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingDeadline: ***REMOVED***
            entry: ["resetDeadline"],
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptSalary"
                ***REMOVED***,
                ***REMOVED***
                  cond: ***REMOVED*** type: "isEventSkip" ***REMOVED***,
                  target: "promptDescription"
                ***REMOVED***,
                ***REMOVED***
                  cond: ***REMOVED*** type: "deadlineValid" ***REMOVED***,
                  target: "promptDescription",
                  actions: "saveDeadline"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          promptDescription: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptDescription",
              src: "promptDescription",
              onDone: ***REMOVED***
                target: "waitingDescription"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingDescription: ***REMOVED***
            entry: ["resetDescription"],
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptDeadline"
                ***REMOVED***,
                ***REMOVED***
                  target: "promptRequirements",
                  actions: "saveDescription",
                  cond: ***REMOVED*** type: "descriptionValid" ***REMOVED***
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          promptRequirements: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptRequirements",
              src: "promptRequirements",
              onDone: ***REMOVED***
                target: "waitingRequirements"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingRequirements: ***REMOVED***
            entry: ["resetRequirements"],
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptDescription"
                ***REMOVED***,
                ***REMOVED***
                  cond: ***REMOVED*** type: "isEventSkip" ***REMOVED***,
                  target: "promptResponsibilities"
                ***REMOVED***,
                ***REMOVED***
                  target: "promptResponsibilities",
                  actions: "saveRequirements"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          promptResponsibilities: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptResponsibilities",
              src: "promptResponsibilities",
              onDone: ***REMOVED***
                target: "waitingResponsibilities"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingResponsibilities: ***REMOVED***
            entry: ["resetResponsibilities"],
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptRequirements"
                ***REMOVED***,
                ***REMOVED***
                  cond: ***REMOVED*** type: "isEventSkip" ***REMOVED***,
                  target: "promptHowToApply"
                ***REMOVED***,
                ***REMOVED***
                  target: "promptHowToApply",
                  actions: "saveResponsibilities"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          promptHowToApply: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptHowToApply",
              src: "promptHowToApply",
              onDone: ***REMOVED***
                target: "waitingHowToApply"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingHowToApply: ***REMOVED***
            entry: ["resetHowToApply"],
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptResponsibilities"
                ***REMOVED***,
                ***REMOVED***
                  cond: ***REMOVED*** type: "isEventSkip" ***REMOVED***,
                  target: "promptApplyMethodChoice"
                ***REMOVED***,
                ***REMOVED***
                  target: "promptApplyMethodChoice",
                  actions: "saveHowToApply"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          promptApplyMethodChoice: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptApplyMethodChoice",
              src: "promptApplyMethodChoice",
              onDone: ***REMOVED***
                target: "waitingForApplyMethodChoice"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingForApplyMethodChoice: ***REMOVED***
            entry: ["resetApplyUrl", "resetApplyEmail"],
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptHowToApply"
                ***REMOVED***,
                ***REMOVED***
                  cond: ***REMOVED*** type: "isEventSkip" ***REMOVED***,
                  target: "promptIsCompanyJob"
                ***REMOVED***,
                ***REMOVED***
                  cond: ***REMOVED*** type: "isEventApplyEmail" ***REMOVED***,
                  target: "promptApplyEmail"
                ***REMOVED***,
                ***REMOVED***
                  cond: ***REMOVED*** type: "isEventApplyUrl" ***REMOVED***,
                  target: "promptApplyUrl"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          promptApplyEmail: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptApplyEmail",
              src: "promptApplyEmail",
              onDone: ***REMOVED***
                target: "waitingApplyEmail"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingApplyEmail: ***REMOVED***
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptApplyMethodChoice"
                ***REMOVED***,
                ***REMOVED***
                  cond: ***REMOVED*** type: "applyEmailValid" ***REMOVED***,
                  target: "promptIsCompanyJob",
                  actions: "saveApplyEmail"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          promptApplyUrl: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptApplyUrl",
              src: "promptApplyUrl",
              onDone: ***REMOVED***
                target: "waitingApplyUrl"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingApplyUrl: ***REMOVED***
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptApplyMethodChoice"
                ***REMOVED***,
                ***REMOVED***
                  target: "promptIsCompanyJob",
                  actions: "saveApplyUrl"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          promptIsCompanyJob: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptIsCompanyJob",
              src: "promptIsCompanyJob",
              onDone: ***REMOVED***
                target: "waitingIsCompanyJob"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingIsCompanyJob: ***REMOVED***
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptApplyMethodChoice"
                ***REMOVED***,
                ***REMOVED***
                  cond: "isEventYes",
                  target: "getUserCompanies"
                ***REMOVED***,
                ***REMOVED***
                  cond: "isEventNo",
                  target: "savingJob"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          getUserCompanies: ***REMOVED***
            invoke: ***REMOVED***
              id: "getUserCompanies",
              src: "getUserCompanies",
              onDone: [
                ***REMOVED***
                  cond: "userHasCompanies",
                  target: "promptChooseCompany",
                  actions: "saveMyCompanies"
                ***REMOVED***,
                ***REMOVED***
                  target: "promptCompanyName"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          promptChooseCompany: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptChooseCompany",
              src: "promptChooseCompany",
              onDone: ***REMOVED***
                target: "waitingCompanyChoice"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingCompanyChoice: ***REMOVED***
            entry: ["resetCompanyId"],
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptIsCompanyJob"
                ***REMOVED***,
                ***REMOVED***
                  cond: "isEventAddCompany",
                  target: "promptCompanyName"
                ***REMOVED***,
                ***REMOVED***
                  cond: "chosenCompanyValid",
                  target: "savingJob",
                  actions: "saveCompanyId"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          promptCompanyName: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptCompanyName",
              src: "promptCompanyName",
              onDone: ***REMOVED***
                target: "waitingCompanyName"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingCompanyName: ***REMOVED***
            entry: ["resetCompanyName"],
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptIsCompanyJob"
                ***REMOVED***,
                ***REMOVED***
                  cond: "companyNameValid",
                  target: "promptCompanyEmail",
                  actions: "saveCompanyName"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          promptCompanyEmail: ***REMOVED***
            invoke: ***REMOVED***
              id: "promptCompanyEmail",
              src: "promptCompanyEmail",
              onDone: ***REMOVED***
                target: "waitingCompanyEmail"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingCompanyEmail: ***REMOVED***
            entry: ["resetCompanyEmail"],
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptCompanyName"
                ***REMOVED***,
                ***REMOVED***
                  cond: "companyEmailValid",
                  target: "savingJob",
                  actions: "saveCompanyEmail"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***,
          savingJob: ***REMOVED***
            invoke: ***REMOVED***
              id: "saveJob",
              src: "saveJob",
              onDone: ***REMOVED***
                target: "#telegramBotMachine.promptMainMenu"
              ***REMOVED***,
              onError: ***REMOVED***
                target: "errorSavingJob"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          errorSavingJob: ***REMOVED***
            invoke: ***REMOVED***
              id: "errorSavingJob",
              src: "promptErrorSavingJob",
              onDone: ***REMOVED***
                target: "waitingErrorSavingJobReply"
              ***REMOVED***
            ***REMOVED***
          ***REMOVED***,
          waitingErrorSavingJobReply: ***REMOVED***
            on: ***REMOVED***
              RECEIVED_UPDATE: [
                ***REMOVED***
                  cond: "isEventBack",
                  target: "promptIsCompanyJob"
                ***REMOVED***,
                ***REMOVED***
                  cond: "isEventRetry",
                  target: "savingJob"
                ***REMOVED***
              ]
            ***REMOVED***
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***,
  ***REMOVED***
    guards: ***REMOVED***
      isEventBack: checkTelegramMessageEvent(MESSAGE_BACK),
      isEventPostJob: checkTelegramMessageEvent(MESSAGE_POST_JOB),
      isEventMyJobs: checkTelegramMessageEvent(MESSAGE_MY_JOBS),
      isEventSkip: checkTelegramMessageEvent(MESSAGE_SKIP),
      isEventApplyEmail: checkTelegramMessageEvent(MESSAGE_APPLY_EMAIL),
      isEventApplyUrl: checkTelegramMessageEvent(MESSAGE_APPLY_URL),
      isEventYes: checkTelegramMessageEvent(MESSAGE_YES),
      isEventNo: checkTelegramMessageEvent(MESSAGE_NO),
      isEventAddCompany: checkTelegramMessageEvent(MESSAGE_ADD_COMPANY),
      isEventRetry: checkTelegramMessageEvent(MESSAGE_RETRY),
      titleValid: (context, event) => ***REMOVED***
        const message = event.update && event.update.message;
        return validation.positionValidator.isValidSync(message.text);
      ***REMOVED***,
      jobTypeValid: (context, event) => ***REMOVED***
        const message = event.update && event.update.message;
        return validation.jobTypeValidator.isValidSync(message.text);
      ***REMOVED***,
      careerLevelValid: (context, event) => ***REMOVED***
        const message = event.update && event.update.message;
        const level = utils.careerLevels.find(
          level => level.label === message.text
        );
        return !!level && validation.careerLevelValidator.isValidSync(level.id);
      ***REMOVED***,
      tagsValid: (context, event) => ***REMOVED***
        const message = event.update && event.update.message;
        const tags = utils.parseTags(message.text);
        return tags.length > 0;
      ***REMOVED***,
      deadlineValid: (context, event) => ***REMOVED***
        const message = event.update && event.update.message;
        return validation.deadlineValidator.isValidSync(message.text);
      ***REMOVED***,
      descriptionValid: (context, event) => ***REMOVED***
        const message = event.update && event.update.message;
        return validation.descriptionValidator.isValidSync(message.text);
      ***REMOVED***,
      applyEmailValid: (context, event) => ***REMOVED***
        const message = event.update && event.update.message;
        return validation.applyEmailValidator.isValidSync(message.text);
      ***REMOVED***,
      userHasCompanies: (context, event) => ***REMOVED***
        const companies = event.data;
        return companies.length > 0;
      ***REMOVED***,
      chosenCompanyValid: (context, event) => ***REMOVED***
        const message = event.update && event.update.message;
        const companyId = parseInt(message.text.split("-")[0]);
        return (
          context.companies.findIndex(company => company.id === companyId) !==
          -1
        );
      ***REMOVED***,
      companyNameValid: (context, event) => ***REMOVED***
        const message = event.update && event.update.message;
        return validation.companyNameValidator.isValidSync(message.text);
      ***REMOVED***,
      companyEmailValid: (context, event) => ***REMOVED***
        const message = event.update && event.update.message;
        return validation.companyEmailValidator.isValidSync(message.text);
      ***REMOVED***,
      isValidApprovalStatus: (context, event) => ***REMOVED***
        const message = event.update && event.update.message;
        return APPROVAL_STATUS_MESSAGES.indexOf(message.text) !== -1;
      ***REMOVED***
    ***REMOVED***,
    actions: ***REMOVED***
      saveTitle: assign(***REMOVED***
        position: (context, event) => event.update.message.text
      ***REMOVED***),
      resetTitle: resetContextField("position"),
      saveJobType: assign(***REMOVED***
        jobType: (context, event) => event.update.message.text
      ***REMOVED***),
      resetJobType: resetContextField("jobType"),
      saveCareerLevel: assign(***REMOVED***
        careerLevel: (context, event) => ***REMOVED***
          const level = utils.careerLevels.find(
            level => level.label === event.update.message.text
          );
          return level && level.id;
        ***REMOVED***
      ***REMOVED***),
      resetCareerLevel: resetContextField("careerLevel"),
      saveLocation: assign(***REMOVED***
        location: (context, event) => event.update.message.text
      ***REMOVED***),
      resetLocation: resetContextField("location"),
      saveTags: assign(***REMOVED***
        tags: (context, event) => utils.parseTags(event.update.message.text)
      ***REMOVED***),
      resetTags: resetContextField("tags"),
      saveSalary: assign(***REMOVED***
        salary: (context, event) => event.update.message.text
      ***REMOVED***),
      resetSalary: resetContextField("salary"),
      saveDeadline: assign(***REMOVED***
        deadline: (context, event) => event.update.message.text
      ***REMOVED***),
      resetDeadline: resetContextField("deadline"),
      saveDescription: assign(***REMOVED***
        description: (context, event) => event.update.message.text
      ***REMOVED***),
      resetDescription: resetContextField("description"),
      saveRequirements: assign(***REMOVED***
        requirements: (context, event) => event.update.message.text
      ***REMOVED***),
      resetRequirements: resetContextField("requirements"),
      saveResponsibilities: assign(***REMOVED***
        responsibilities: (context, event) => event.update.message.text
      ***REMOVED***),
      resetResponsibilities: resetContextField("responsibilities"),
      saveHowToApply: assign(***REMOVED***
        howToApply: (context, event) => event.update.message.text
      ***REMOVED***),
      resetHowToApply: resetContextField("howToApply"),
      saveApplyEmail: assign(***REMOVED***
        applyEmail: (context, event) => event.update.message.text
      ***REMOVED***),
      resetApplyEmail: resetContextField("applyEmail"),
      saveApplyUrl: assign(***REMOVED***
        applyUrl: (context, event) => event.update.message.text
      ***REMOVED***),
      resetApplyUrl: resetContextField("applyUrl"),
      saveMyCompanies: assign(***REMOVED***
        companies: (context, event) => event.data
      ***REMOVED***),
      resetCompanies: resetContextField("companies"),
      saveCompanyId: assign(***REMOVED***
        companyId: (context, event) => ***REMOVED***
          return parseInt(event.update.message.text.split("-")[0]);
        ***REMOVED***
      ***REMOVED***),
      resetCompanyId: resetContextField("companyId"),
      saveCompanyName: assign(***REMOVED***
        companyName: (context, event) => event.update.message.text
      ***REMOVED***),
      resetCompanyName: resetContextField("companyName"),
      saveCompanyEmail: assign(***REMOVED***
        companyEmail: (context, event) => event.update.message.text
      ***REMOVED***),
      resetCompanyEmail: resetContextField("companyEmail"),
      setApprovalStatus: assign(***REMOVED***
        currentApprovalStatus: (context, event) => ***REMOVED***
          return MESSAGE_APPROVAL_STATUS_MAP[event.update.message.text];
        ***REMOVED***
      ***REMOVED***)
    ***REMOVED***,
    services: ***REMOVED***
      promptMainMenu: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          "Choose an option",
          ***REMOVED***
            replyMarkup: ***REMOVED***
              keyboard: [
                [***REMOVED*** text: MESSAGE_POST_JOB ***REMOVED***, ***REMOVED*** text: MESSAGE_MY_JOBS ***REMOVED***]
              ],
              resize_keyboard: true
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
              keyboard: [[***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]],
              resize_keyboard: true
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
              keyboard: _.chunk(
                utils.jobTypes.map(jobType => (***REMOVED*** text: jobType ***REMOVED***)),
                3
              ).concat([
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ]),
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptCareerLevel: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          "Choose the job's required level of experience",
          ***REMOVED***
            replyMarkup: ***REMOVED***
              keyboard: _.chunk(
                utils.careerLevels.map(careerLevel => (***REMOVED***
                  text: careerLevel.label
                ***REMOVED***)),
                1
              ).concat([
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ]),
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptLocation: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          "Enter job location",
          ***REMOVED***
            replyMarkup: ***REMOVED***
              keyboard: [
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***, ***REMOVED*** text: MESSAGE_SKIP ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ],
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptTags: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Please enter some tags(at least one) that describe the job(separated by comma)
          
E.g. Accounting, NGO, Information Technology, Driver, Messenger etc.`,
          ***REMOVED***
            replyMarkup: ***REMOVED***
              keyboard: [
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ],
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptSalary: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter Salary
          
_(Salary is not required, but recommended for better job visibility)_`,
          ***REMOVED***
            parseMode: "Markdown",
            replyMarkup: ***REMOVED***
              keyboard: [
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***, ***REMOVED*** text: MESSAGE_SKIP ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ],
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptDeadline: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter Application Deadline
          
_(Format YYYY-MM-DD E.g. 2020-02-23)_`,
          ***REMOVED***
            parseMode: "Markdown",
            replyMarkup: ***REMOVED***
              keyboard: [
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***, ***REMOVED*** text: MESSAGE_SKIP ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ],
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptDescription: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter Job Description
          
(Supports [Markdown](https://www.markdownguide.org/basic-syntax/))`,
          ***REMOVED***
            parseMode: "Markdown",
            replyMarkup: ***REMOVED***
              keyboard: [
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ],
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptRequirements: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter Job Requirements
          
(Supports [Markdown](https://www.markdownguide.org/basic-syntax/))`,
          ***REMOVED***
            parseMode: "Markdown",
            replyMarkup: ***REMOVED***
              keyboard: [
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***, ***REMOVED*** text: MESSAGE_SKIP ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ],
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptResponsibilities: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter Job Responsibilities
          
(Supports [Markdown](https://www.markdownguide.org/basic-syntax/))`,
          ***REMOVED***
            parseMode: "Markdown",
            replyMarkup: ***REMOVED***
              keyboard: [
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***, ***REMOVED*** text: MESSAGE_SKIP ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ],
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptHowToApply: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter instructions for interested applicants on how they can apply for the job.
          
(Supports [Markdown](https://www.markdownguide.org/basic-syntax/))`,
          ***REMOVED***
            parseMode: "Markdown",
            replyMarkup: ***REMOVED***
              keyboard: [
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***, ***REMOVED*** text: MESSAGE_SKIP ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ],
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptApplyMethodChoice: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Allow candidates to apply via email or throgh a custom url?`,
          ***REMOVED***
            replyMarkup: ***REMOVED***
              keyboard: [
                [***REMOVED*** text: MESSAGE_APPLY_EMAIL ***REMOVED***, ***REMOVED*** text: MESSAGE_APPLY_URL ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***, ***REMOVED*** text: MESSAGE_SKIP ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ],
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptApplyEmail: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter the email address where interested candidates can apply to`,
          ***REMOVED***
            replyMarkup: ***REMOVED***
              keyboard: [
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ],
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptApplyUrl: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter the application url where interested candidates can apply to`,
          ***REMOVED***
            replyMarkup: ***REMOVED***
              keyboard: [
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ],
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptIsCompanyJob: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Is this job at a company/organization`,
          ***REMOVED***
            replyMarkup: ***REMOVED***
              keyboard: [
                [***REMOVED*** text: MESSAGE_YES ***REMOVED***, ***REMOVED*** text: MESSAGE_NO ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ],
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      getUserCompanies: async context => ***REMOVED***
        if (!context.userId) ***REMOVED***
          throw new Error("User not found");
        ***REMOVED***
        const companies = await db.getCompanies(parseInt(context.userId));
        return companies;
      ***REMOVED***,
      promptChooseCompany: async context => ***REMOVED***
        const companies = await db.getCompanies(parseInt(context.userId));
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Choose a company for this job`,
          ***REMOVED***
            replyMarkup: ***REMOVED***
              keyboard: [
                ...companies.map(company => ***REMOVED***
                  return [***REMOVED*** text: `$***REMOVED***company.id***REMOVED***-$***REMOVED***company.name***REMOVED***` ***REMOVED***];
                ***REMOVED***),
                [***REMOVED*** text: MESSAGE_ADD_COMPANY ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ],
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptCompanyName: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter Company Name`,
          ***REMOVED***
            replyMarkup: ***REMOVED***
              keyboard: [
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ],
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptCompanyEmail: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Enter Company Email Address
          
_(Email is kept strictly confidential. Job applicants won't be able to see your company email)_`,
          ***REMOVED***
            parseMode: "Markdown",
            replyMarkup: ***REMOVED***
              keyboard: [
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ],
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      saveJob: async context => ***REMOVED***
        const user = await db.getUserById(context.userId);
        const data = await jobHandler.createJob(user, context);
        await telegramBot.sendMessage(
          context.telegramUserId,
          `🎉🎉🎉Job Successfully Created🎉🎉🎉. $***REMOVED***data.job.approvalStatus ===
            "Pending" && `It will be live once it gets admin approval.`***REMOVED***
              
You'll be notified once your job is live.`
        );
      ***REMOVED***,
      promptErrorSavingJob: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          `🙈 Failed trying to save job. Press retry to try again. 😰`,
          ***REMOVED***
            replyMarkup: ***REMOVED***
              keyboard: [
                [***REMOVED*** text: MESSAGE_RETRY ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK ***REMOVED***],
                [***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]
              ],
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      promptMyJobs: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          `Choose a category of jobs`,
          ***REMOVED***
            replyMarkup: ***REMOVED***
              keyboard: _.chunk(
                APPROVAL_STATUS_MESSAGES.map(appStatusMessage => (***REMOVED***
                  text: appStatusMessage
                ***REMOVED***)),
                2
              ).concat([[***REMOVED*** text: MESSAGE_BACK_TO_MAIN_MENU ***REMOVED***]]),
              resize_keyboard: true
            ***REMOVED***
          ***REMOVED***
        );
      ***REMOVED***,
      getMyJobs: async context => ***REMOVED***
        const jobs = await db.getJobs(***REMOVED***
          ownerId: context.userId,
          approvalStatus: context.currentApprovalStatus
        ***REMOVED***);
        const sendJob = jobData => ***REMOVED***
          const ***REMOVED*** job ***REMOVED*** = jobData;
          const viewOnWebButtonRow =
            job.approvalStatus === "Active"
              ? [
                  [
                    ***REMOVED***
                      text: "🌍 View on web",
                      url: utils.jobUrlFromSlug(job.slug)
                    ***REMOVED***
                  ]
                ]
              : [];
          const closeJobButtonRow =
            job.approvalStatus === "Active" || job.approvalStatus === "Pending"
              ? [
                  [
                    ***REMOVED***
                      text: "🚪 Close Job",
                      callback_data: JSON.stringify(***REMOVED***
                        event: EVENT_CLOSE_JOB,
                        id: job.id
                      ***REMOVED***)
                    ***REMOVED***
                  ]
                ]
              : [];
          return telegramBot.sendMessage(
            context.telegramUserId,
            socialHandler.createJobMessage(jobData),
            ***REMOVED***
              replyMarkup: ***REMOVED***
                inline_keyboard: [...viewOnWebButtonRow, ...closeJobButtonRow]
              ***REMOVED***
            ***REMOVED***
          );
        ***REMOVED***;
        try ***REMOVED***
          if (jobs.length === 0) ***REMOVED***
            await telegramBot.sendMessage(
              context.telegramUserId,
              `😐 No Jobs in $***REMOVED***context.currentApprovalStatus***REMOVED*** Category`
            );
          ***REMOVED*** else ***REMOVED***
            await Promise.all(jobs.map(jobData => sendJob(jobData)));
          ***REMOVED***
        ***REMOVED*** catch (err) ***REMOVED***
          console.log(err);
          throw err;
        ***REMOVED***
        //console.log(***REMOVED*** myJobs: jobs ***REMOVED***);
      ***REMOVED***,
      errorGettingJobs: async context => ***REMOVED***
        await telegramBot.sendMessage(
          context.telegramUserId,
          `🙈 Failed trying to retreive your jobs.`
        );
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
);

exports.handleTelegramUpdate = async (req, res) => ***REMOVED***
  console.log("incoming request");
  const update = req.body;
  const telegramUser = telegramBot.userFromIncomingUpdate(update);
  console.log(***REMOVED*** update, telegramUser ***REMOVED***);
  if (!telegramUser) ***REMOVED***
    res.sendStatus(200);
    return;
  ***REMOVED***
  let botMachine = machine;
  let previousState = await getPersistedState(telegramUser.id);
  console.log("previousState");
  let currentState;
  if (previousState) ***REMOVED***
    currentState = botMachine.resolveState(previousState);
  ***REMOVED*** else ***REMOVED***
    const user = await db.findOrCreateTelegramUser(***REMOVED***
      ...telegramUser,
      role: "user"
    ***REMOVED***);
    botMachine = machine.withContext(***REMOVED***
      ...machine.context,
      userId: user.id,
      telegramUserId: telegramUser.id
    ***REMOVED***);
    currentState = botMachine.initialState;
  ***REMOVED***
  console.log("starting interpreter");
  const service = interpret(botMachine);
  service.onTransition(state => ***REMOVED***
    if (state.changed) ***REMOVED***
      persistState(telegramUser.id, state);
    ***REMOVED***
  ***REMOVED***);
  console.log("starting service");
  service.start(currentState);
  if (update.callback_query) ***REMOVED***
    const callbackQuery = update.callback_query;
    if (callbackQuery.data) ***REMOVED***
      let callbackData;
      try ***REMOVED***
        callbackData = JSON.parse(callbackQuery.data);
      ***REMOVED*** catch (err) ***REMOVED***
        console.log("Problem parsing event from callback data");
      ***REMOVED***
      if (callbackData.event === EVENT_CLOSE_JOB) ***REMOVED***
        await closeJob(
          telegramUser.id,
          callbackQuery.id,
          parseInt(callbackData.id)
        );
        res.sendStatus(200);
        return;
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***
  if (update.message && update.message.text === MESSAGE_START) ***REMOVED***
    service.send(***REMOVED*** type: EVENT_START ***REMOVED***);
  ***REMOVED*** else if (
    update.message &&
    update.message.text === MESSAGE_BACK_TO_MAIN_MENU
  ) ***REMOVED***
    service.send(***REMOVED*** type: EVENT_BACK_TO_MAIN_MENU ***REMOVED***);
  ***REMOVED*** else ***REMOVED***
    service.send(***REMOVED*** type: "RECEIVED_UPDATE", update ***REMOVED***);
  ***REMOVED***
  res.sendStatus(200);
***REMOVED***;

async function closeJob(telegramUserId, callbackQueryId, jobId) ***REMOVED***
  const user = await db.getUserByTelegramId(telegramUserId);
  if (user) ***REMOVED***
    try ***REMOVED***
      const numClosed = await db.closeJob(jobId, ***REMOVED*** ownerId: user.id ***REMOVED***);
      if (numClosed > 0) ***REMOVED***
        telegramBot.answerCallbackQuery(callbackQueryId, ***REMOVED***
          text: "Job Closed Successfully",
          showAlert: true
        ***REMOVED***);
      ***REMOVED*** else ***REMOVED***
        telegramBot.answerCallbackQuery(callbackQueryId, ***REMOVED***
          text: `Couldn't close job. It may have been closed before`,
          showAlert: true
        ***REMOVED***);
      ***REMOVED***
      return;
    ***REMOVED*** catch (err) ***REMOVED***
      console.log(err);
    ***REMOVED***
  ***REMOVED***
  telegramBot.answerCallbackQuery(callbackQueryId, ***REMOVED***
    text: "🙈 Problem occurred closing job",
    showAlert: true
  ***REMOVED***);
***REMOVED***

async function getPersistedState(telegramUserId) ***REMOVED***
  let rawState = await redis.get(`telegram_user_$***REMOVED***telegramUserId***REMOVED***`);
  console.log(***REMOVED*** redisState: rawState ***REMOVED***);
  if (rawState) ***REMOVED***
    return State.create(JSON.parse(rawState));
  ***REMOVED***
***REMOVED***

async function persistState(telegramUserId, state) ***REMOVED***
  return redis.set(
    `telegram_user_$***REMOVED***telegramUserId***REMOVED***`,
    JSON.stringify(state),
    "ex",
    24 * 60 * 60
  );
***REMOVED***
