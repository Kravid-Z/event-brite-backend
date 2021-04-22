import express from "express";
import { v4 as uuid } from "uuid";
import { check, validationResult } from "express-validator";
import {getAttendees, writeAttendees} from "./fsx-services-attendees.js"

const router = express.Router();
const middlewareValidator = [
  check("FirstName").exists().withMessage("FirstName is mandatory field!"),
  check("SecondName").exists().withMessage("SecondName is mandatory field!"),
  check("email")
    .exists()
    .isEmail()
    .withMessage("Please add email to send you a remind of this event"),
  check("TimeOfArrival")
    .exists()
    .withMessage("Please lett us know time you'll arrive"),
];

/**SCHEMA ATTENDEES
 *      - userID (generated server)
        - First Name
        - Second Name
        - Email
        - Time of Arrival (a string is ok)
        - event_id: Added by Server  
 */

// Get all ATTENDEES for specific Event
router.get("/:eventID", async (req, res, next) => {
  try {
    const attendees = await getAttendees();
    const attendsSpecificEvent = attendees.find(
      (attend) => attend.event_id === req.params.eventID
    );
    if (attendsSpecificEvent) {
      res.send(attendsSpecificEvent);
    } else {
      const err = new Error();
      err.frontEndMssg = "Not attendees for this event check eventID, please";
      err.statusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(
      "error in Get all ATTENDEES for specific Event, pasing it to errorHandling" +
        error
    );
    next(error);
  }
});
// POST ATTENDANT for that event
router.post("/:eventID", middlewareValidator, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error();
      err.errorList = errors;
      err.statusCode = 400;
      next("error in POST Attendant, pasing it to errorHandling", err); // passing error to errorHandling
    } else {
      const attendees = await getAttendees();
      const newAttendant = {
        ...req.body,
        event_id: req.params.eventID,
        userID: uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      attendees.push(newAttendant);
      await writeAttendees(attendees);
      res.status(201).send({ userID: newAttendant.userID }).next(newAttendant);
    }
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

export default router;
