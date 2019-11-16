class Tag {
  constructor(name, isPrimary) {
    this.name = name;
    this.isPrimary = isPrimary;
  }

  static fromDb(dbTag) {
    const tag = new Tag(dbTag.name, dbTag.is_primary);
    return tag;
  }
}

module.exports = Tag;
