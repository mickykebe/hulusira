class User {
  constructor(id, firstName, lastName, email, password, confirmed, role) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.confirmed = confirmed;
    this.role = role;
  }

  static fromDb(dbUser) {
    const user = new User(
      dbUser.id,
      dbUser.first_name,
      dbUser.last_name,
      dbUser.email,
      dbUser.password,
      dbUser.confirmed,
      dbUser.role
    );
    return user;
  }

  publicData() {
    const { password, confirmed, ...rest } = this;
    return rest;
  }
}

module.exports = User;
