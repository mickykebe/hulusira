class Company {
  constructor(id, name, email, logo) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.logo = logo;
  }

  static fromDb(dbCompany) {
    const company = new Company(
      dbCompany.company_id,
      dbCompany.company_name,
      dbCompany.company_email,
      dbCompany.company_logo
    );
    return company;
  }
}

module.exports = Company;
