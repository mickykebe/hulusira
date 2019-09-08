class Tag ***REMOVED***
  constructor(id, name, isPrimary) ***REMOVED***
    this.id = id;
    this.name = name;
    this.isPrimary = isPrimary;
  ***REMOVED***

  static fromDb(dbTag) ***REMOVED***
    const tag = new Tag(dbTag.id, dbTag.name, dbTag.is_primary);
    return tag;
  ***REMOVED***
***REMOVED***

module.exports = Tag;
