const express = require("express");
const passport = require("passport");
const Location = require("../models/Location");
const APIError = require("../utils/APIError.js");

const router = express.Router();

// List
router.get("/", (req, res) => {
  const location = new Location(req.query);
  location
    .readAll()
    .then(data => res.json(data))
    .catch(err => {
      res.status(err.statusCode || 400).json({ message: err.message });
    });
});

// Create
router.post("/", passport.authenticate("userRequired"), (req, res) => {
  const location = new Location(req.body);
  location
    .create()
    .then(([data]) => {
      res.status(201).json(data);
    })
    .catch(err => {
      res.status(err.statusCode || 400).json({ message: err.message });
    });
});

// Get one
router.get("/:id", (req, res) => {
  const location = new Location({ id: req.params.id });
  location
    .read()
    .then(([data]) => {
      if (data === undefined) {
        throw new APIError(`location #${req.params.id} not found`, 404);
      }
      res.json(data);
    })
    .catch(err => {
      res.status(err.statusCode || 400).json({ message: err.message });
    });
});

// delete one
router.delete("/:id", passport.authenticate("userRequired"), (req, res) => {
  const location = new Location({ id: req.params.id });
  location
    .delete()
    .then(() => {
      res.status(204).json();
    })
    .catch(err => {
      res.status(err.statusCode || 400).json({ message: err.message });
    });
});

// update one
router.put("/:id", passport.authenticate("userRequired"), (req, res) => {
  const { id, ...newData } = req.body;
  const location = new Location({ id: req.params.id, ...newData });
  location
    .update()
    .then(() => {
      res.json();
    })
    .catch(err => {
      res.status(err.statusCode || 400).json({ message: err.message });
    });
});

module.exports = router;
