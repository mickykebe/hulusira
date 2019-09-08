class Company ***REMOVED***
  constructor(id, name, email, logo) ***REMOVED***
    this.id = id;
    this.name = name;
    this.email = email;
    this.logo = logo;
  ***REMOVED***

  static fromDb(dbCompany) ***REMOVED***
    const company = new Company(
      dbCompany.id,
      dbCompany.name,
      dbCompany.email,
      dbCompany.logo
    );
    return company;
  ***REMOVED***
***REMOVED***

module.exports = Company;
