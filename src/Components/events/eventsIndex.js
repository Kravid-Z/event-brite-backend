import express from "express";
import { v4 as uuid } from "uuid";
import { check, validationResult } from "express-validator";
import { getEvents, writeEvents } from "./fsx-services-events.js";

const router = express.Router();
const middlewareValidator = [
  check("eventName").exists().withMessage("EventName is mandatory field!"),
  check("description").exists().withMessage("Description is mandatory field!"),
];

/**SCHEMA EVENTS
 *      - event_id (generated server)
        - eventName
        - Description
        - imgEvent 
 */

// const cloudinaryStorage = new CloudinaryStorage({
//   cloudinary: v2,
//   params: {
//     folder: "book-strive",
//   },
// });

// const uploader = multer({ storage: cloudinaryStorage });

// Get all EVENTS
router.get("/", async (req, res, next) => {
  try {
    const events = await getEvents();

    if (req.query && req.query.title) {
      const filteredEvents = events.filter(
        (e) =>
          e.hasOwnProperty("eventName") && e.eventName === req.query.eventName
      );
      res.send(filteredEvents);
    } else {
      res.send(events);
    }
  } catch (error) {
    console.log(
      "error in GET all events or filtered by query, pasing it to errorHandling",
      error
    );
    next(error);
  }
});
// POST NEW EVENT
router.post("/", middlewareValidator, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error();
      err.errorList = errors;
      err.statusCode = 400;
      console.log(err.errorList);
      next("error in POST Event, pasing it to errorHandling", err); // passing error to errorHandling
    } else {
      const events = await getEvents();
      const newEvent = {
        ...req.body,
        event_id: uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      events.push(newEvent);
      await writeEvents(events);
      res.status(201).send({ event_id: newEvent.event_id });
    }
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

// router.post("/upload", uploader.single("eventImg"), async (req, res, next) => {
//   try {
//     //NEED TO Save cloudinaryURL in mi db books.json || another TABLE.json ??
//     res.send({ cloudinaryURL: req.file.path });
//   } catch (error) {
//     next(error);
//   }
// });

export default router;
