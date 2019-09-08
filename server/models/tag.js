class Tag {
  constructor(id, name, isPrimary) {
    this.id = id;
    this.name = name;
    this.isPrimary = isPrimary;
  }

  static fromDb(dbTag) {
    const tag = new Tag(dbTag.id, dbTag.name, dbTag.is_primary);
    return tag;
  }
}

module.exports = Tag;
