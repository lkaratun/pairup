const Table = require("./Table");

class Event extends Table {
  constructor(rawData = {}) {
    const pk = "id";
    const tableName = "events";
    const ACCEPTED_FIELDS = [
      "id",
      "name",
      "authorId",
      "image",
      "description",
      "activityId",
      "placeId",
      "dateFrom",
      "dateTo",
      "minPeople",
      "maxPeople"
    ];
    const cleanData = {};
    Object.keys(rawData).forEach(key => {
      if (ACCEPTED_FIELDS.includes(key)) {
        cleanData[key] = rawData[key];
      }
    });
    super(tableName, pk, cleanData);
    this.ACCEPTED_FIELDS = ACCEPTED_FIELDS;
    this.REQUIRED_FIELDS = ["name", "activityId", "authorId"];
    this.parseOpts(rawData);
  }

  readAll(timestamp) {
    const text = `SELECT
    events.id, events.name, author_id, CONCAT(users.first_name, ' ', users.last_name) as author, events.image, events.description,
    activities.name as activity, places.country, places.city,
    events.date_from, events.date_to, events.min_people, events.max_people
    FROM ${this.tableName}
    LEFT JOIN users ON users.id = events.author_id
    LEFT JOIN activities ON activities.id = events.activity_id
    LEFT JOIN places ON places.id = events.place_id`;

    let where;
    let whereValues;
    if (timestamp) {
      where = " WHERE to_timestamp($1) BETWEEN date_from AND date_to";
      whereValues = [timestamp / 1000];
    }
    return super.readAll(text, where, whereValues);
  }
}

module.exports = Event;
