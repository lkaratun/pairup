// DB Population script, use settings from ../models/db.js
const fs = require("fs");
const User = require("../models/User");
const Location = require("../models/Location");
const Activity = require("../models/Activity");
const Event = require("../models/Event");
const Attendee = require("../models/EventAttendee");

const myArgs = process.argv.slice(2);
if (myArgs.length > 1) {
  throw new Error("Too many arguments, only one filename is accepted");
} else if (myArgs.length === 0) {
  throw new Error("Please pass filename to parse");
}

const data = JSON.parse(fs.readFileSync(myArgs[0]));

Promise.all(
  // create users, activities and locations first and append their id's to base object
  data.users.map((userData, pos) =>
    new User(userData)
      .create()
      .then(res => {
        data.users[pos].id = res.id;
      })
      .catch(console.log)
  ),
  data.locations.map((locationData, pos) =>
    new Location(locationData)
      .create()
      .then(([res]) => {
        data.locations[pos].id = res.id;
      })
      .catch(console.log)
  ),
  data.activities.map((activityData, pos) =>
    new Activity(activityData)
      .create()
      .then(([res]) => {
        data.activities[pos].id = res.id;
      })
      .catch(console.log)
  )
)
  // Create events
  .then(() =>
    Promise.all(
      data.events
        .map(eventData => {
          const fullEventData = {
            ...eventData,
            author_id: data.users[eventData.author_id].id,
            activity_id: data.activities[eventData.activity_id].id
          };
          if ("location_id" in eventData) {
            fullEventData.location_id =
              data.locations[eventData.location_id].id;
          }
          return fullEventData;
        })
        .map((eventData, pos) =>
          new Event(eventData)
            .create()
            .then(([res]) => {
              data.events[pos].id = res.id;
            })
            .catch(console.log)
        )
    )
  )
  // create event attendees
  .then(() => {
    data.event_attendees.map(eaData => {
      const fullEAData = {
        event_id: data.events[eaData.event_id].id,
        user_id: data.users[eaData.user_id].id
      };
      return new Attendee(fullEAData).create().catch(console.log);
    });
  })
  .catch(console.log);
