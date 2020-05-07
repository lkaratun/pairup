const Table = require("./Table");

class EventAttendee extends Table {
  constructor(rawData = {}) {
    const pk = "id";
    const tableName = "event_attendees";
    const ACCEPTED_FIELDS = ["id", "eventId", "userId"];
    const cleanData = {};
    Object.keys(rawData).forEach(key => {
      if (ACCEPTED_FIELDS.includes(key)) {
        cleanData[key] = rawData[key];
      }
    });
    super(tableName, pk, cleanData);
    this.ACCEPTED_FIELDS = ACCEPTED_FIELDS;
    this.REQUIRED_FIELDS = ["event_id", "user_id"];
    this.parseOpts(rawData);
  }

  getAttendeesForEvent(eventId) {
    const text = `SELECT users.*
    FROM event_attendees INNER JOIN users
    ON event_attendees.user_id = users.id
    WHERE event_attendees.event_id = ${eventId}`;
    return super.readAll(text);
  }

  getEventsForAttendee(userId) {
    const text = `SELECT * 
    FROM event_attendees INNER JOIN events
    ON event_attendees.event_id = events.id
    WHERE event_attendees.user_id = ${userId}`;
    return super.readAll(text);
  }
}

module.exports = EventAttendee;
