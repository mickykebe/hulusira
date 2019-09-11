class Company ***REMOVED***
  constructor(id, name, email, logo) ***REMOVED***
    this.id = id;
    this.name = name;
    this.email = email;
    this.logo = logo;
  ***REMOVED***

  static fromDb(dbCompany) ***REMOVED***
    const company = new Company(
      dbCompany.company_id,
      dbCompany.company_name,
      dbCompany.company_email,
      dbCompany.company_logo
    );
    return company;
  ***REMOVED***
***REMOVED***

module.exports = Company;
