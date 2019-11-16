class Tag ***REMOVED***
  constructor(name, isPrimary) ***REMOVED***
    this.name = name;
    this.isPrimary = isPrimary;
  ***REMOVED***

  static fromDb(dbTag) ***REMOVED***
    const tag = new Tag(dbTag.name, dbTag.is_primary);
    return tag;
  ***REMOVED***
***REMOVED***

module.exports = Tag;
