class User ***REMOVED***
  constructor(
    id,
    firstName,
    lastName,
    email,
    password,
    confirmed,
    role,
    telegramId,
    telegramUserName
  ) ***REMOVED***
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.confirmed = confirmed;
    this.role = role;
    this.telegramId = telegramId;
    this.telegramUserName = telegramUserName;
  ***REMOVED***

  static fromDb(dbUser) ***REMOVED***
    const user = new User(
      dbUser.id,
      dbUser.first_name,
      dbUser.last_name,
      dbUser.email,
      dbUser.password,
      dbUser.confirmed,
      dbUser.role,
      dbUser.telegram_id,
      dbUser.telegram_user_name
    );
    return user;
  ***REMOVED***

  publicData() ***REMOVED***
    const ***REMOVED*** password, confirmed, ...rest ***REMOVED*** = this;
    return rest;
  ***REMOVED***
***REMOVED***

module.exports = User;
