const express = require("express");
const passport = require("passport");
const Event = require("../models/Event");
const Attendee = require("../models/EventAttendee");
const APIError = require("../utils/APIError.js");
const upload = require("../utils/upload");
const { userOptional } = require("../middleware/localAuth.js");

const router = express.Router();

// get event info
router.get("/:id", userOptional, async (req, res) => {
  console.log("req.user in events = ", req.user);
  console.log("req.params.id", req.params.id);

  const [event, attendees] = await Promise.all([
    new Event({ id: req.params.id }).read(),
    new Attendee({ eventId: req.params.id }).getAttendeesForEvent()
  ]).catch(err => {
    res.status(err.statusCode || 400).json({ message: err.message });
  });

  if (!event) {
    return res.status(404).json(`event #${req.params.id} not found`);
  }
  event.currentUserAttending = attendees
    .map(person => person.id)
    .includes(req.user.id);

  return res.json(event);
});

// list all events, with parameters
router.get("/", (req, res) => {
  const newEvent = new Event(req.query);
  newEvent
    .readAll(req.query?.timestamp)
    .then(data => res.json(data))
    .catch(err => {
      res.status(err.statusCode || 400).json({ message: err.message });
    });
});

// create an event
router.post("/", passport.authenticate("userRequired"), (req, res) => {
  console.log("In create event route");

  const newEvent = new Event({ authorId: req.user.id, ...req.body });
  newEvent
    .create()
    .then(data => {
      console.log("data", data);
      newEvent.data = data;
      const attendee = new Attendee({
        userId: req.user.id,
        eventId: data.id
      });
      return attendee.create();
    })
    .then(attendee => {
      console.log("attendee", attendee);
      return res.status(201).json(newEvent.data);
    })
    .catch(err => {
      res.status(err.statusCode || 400).json({ message: err.message });
    });
});

router.get("/:id/attendees", async (req, res) => {
  const eventData = await new Event({ id: req.params.id }).read().catch(err => {
    res.status(err.statusCode || 400).json({ message: err.message });
  });

  if (eventData === undefined) {
    throw new APIError(`event #${req.params.id} not found`, 404);
  }
  const attendeeData = await new Attendee({ eventId: req.params.id })
    .getAttendeesForEvent(eventData.id)
    .catch(err => {
      res.status(err.statusCode || 400).json({ message: err.message });
    });
  res.json(attendeeData);
});

// delete an event
router.delete("/:id", passport.authenticate("userRequired"), (req, res) => {
  const newEvent = new Event({ id: req.params.id });
  newEvent
    .read()
    .then(data => {
      if (data === undefined) {
        throw new APIError(`event #${req.params.id} not found`, 404);
      } else if (data.authorId !== req.user.id) {
        throw new APIError(
          `you are not the author of event #${req.params.id}`,
          403
        );
      }
      return newEvent.delete();
    })
    .then(res.status(204).json())
    .catch(err =>
      res.status(err.statusCode || 400).json({ message: err.message })
    );
});

// update an event
router.put("/:id", passport.authenticate("userRequired"), (req, res) => {
  const { id, ...newData } = req.body;
  const newEvent = new Event({ id: req.params.id, ...newData });
  new Event({ id: req.params.id })
    .read()
    .then(data => {
      if (data === undefined) {
        throw new APIError(`event #${req.params.id} not found`, 404);
      } else if (data.authorId !== req.user.id) {
        throw new APIError(
          `you are not the author of event #${req.params.id}`,
          403
        );
      }
      return newEvent.update();
    })
    .then(() => {
      res.json();
    })
    .catch(err => {
      res.status(err.statusCode || 400).json({ message: err.message });
    });
});

// attend an event
router.post(
  "/:id/attend",
  passport.authenticate("userRequired"),
  (req, res) => {
    const attendees = new Attendee({ eventId: req.params.id });
    const attendee = new Attendee({
      userId: req.user.id,
      eventId: req.params.id
    });
    let maxPeople;
    new Event({ id: req.params.id })
      .read()
      .then(data => {
        if (!data) {
          throw new APIError(`event #${req.params.id} not found`, 404);
        } else if (Number(data.authorId) === Number(req.user.id)) {
          throw new APIError("cant subscribe your own event", 403);
        }
        maxPeople = Number(data.maxPeople);
        return attendees.readAll();
      })
      .then(data => {
        console.log("data", data);
        if (data.filter(user => user.userId === req.user.id).length === 1) {
          throw new APIError("you are already in the attendees list", 400);
        } else if (maxPeople && data.length >= maxPeople) {
          throw new APIError("event is completely booked", 403);
        }
        return attendee.create();
      })
      .then(() => res.status(201).json(req.user))
      .catch(err => {
        res.status(err.statusCode || 400).json({ message: err.message });
      });
  }
);

// Cancel attendance for an event
router.delete(
  "/:id/attend",
  passport.authenticate("userRequired"),
  (req, res) => {
    const attendee = new Attendee({
      userId: req.user.id,
      eventId: req.params.id
    });
    new Event({ id: req.params.id })
      .read()
      .then(data => {
        if (!data) {
          throw new APIError(`event not #${req.params.id} found`, 404);
        } else if (Number(data.authorId) === Number(req.user.id)) {
          throw new APIError("cant unsubscribe from your own event", 403);
        }
        return attendee.read();
      })
      .then(data => {
        console.log("data", data);
        if (!data) {
          throw new APIError("you are not attendee of this event", 400);
        }
        attendee.data.id = data.id;
        console.log("attendee", attendee);
        return attendee.delete();
      })
      .then(response => {
        res.status(204).json(response);
      })
      .catch(err => {
        res.status(err.statusCode || 400).json({ message: err.message });
      });
  }
);

router.post(
  "/:id/images",
  passport.authenticate("userRequired"),
  (req, res) => {
    const imageHandler = upload("events", {
      width: 500,
      height: 500,
      crop: "limit"
    }).single("file");
    // check if event exists
    new Event({ id: req.params.id })
      .read()
      .then(data => {
        if (data === undefined) {
          throw new APIError(`event #${req.params.id} not found`, 404);
        } else if (data.authorId !== req.user.id) {
          throw new APIError(
            `you are not the author of event #${req.params.id}`,
            403
          );
        }
      })
      .then(() => {
        // upload image
        imageHandler(req, res, err => {
          if (err) {
            // upload failed
            res.status(400).json({ message: err.message });
          } else if (!req.file) {
            res.status(400).json({ message: "File is not set" });
          } else {
            new Event({ id: req.params.id, image: req.file.secure_url })
              .update()
              // update failed
              .catch(e => res.status(400).json({ message: e.message }));
            res.status(201).json({ url: req.file.secure_url });
          }
        });
      })
      .catch(err => {
        res.status(err.statusCode || 400).json({ message: err.message });
      });
    return res;
  }
);

module.exports = router;
