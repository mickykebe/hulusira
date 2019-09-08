class Company {
  constructor(id, name, email, logo) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.logo = logo;
  }

  static fromDb(dbCompany) {
    const company = new Company(
      dbCompany.id,
      dbCompany.name,
      dbCompany.email,
      dbCompany.logo
    );
    return company;
  }
}

module.exports = Company;
