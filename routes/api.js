var express = require('express');
var router = express.Router();
var passport = require('passport');
var { checkSchema, validationResult } = require('express-validator/check');
var validators = require('../core/validators.js');
var dataLayer = require('../core/datalayer.js');


 /*
  * Returns all events for a specified time range. Accepts the following querystring paramters:
  *     startDate = "11/16/2018 12:00 PM"
  *     stopDate = "11/16/2018 2:00 PM"
  *     index = 0
  *     num = 5
  * 
  * Above example returns up to 5 events between 11/16/2018 12:00 PM and 11/16/2018 2:00 PM.
  * Max number of events is determined by validators.js/eventsInputSchema. Providing -1 for
  * num indicates that all events from the index onward should be returned.
  * 
  * Returns an empty object if no events are found.
  */
router.get('/events', checkSchema(validators.eventsInputSchema), function(req, res, next) {

  var errors = validationResult(req);
  
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  var events = new dataLayer.DataLayer().getEventsByDate(req.user.userId, req.query.startDate, req.query.stopDate, req.query.index, req.query.num);

  if(events !== undefined) {
    return res.json({ result: events });
  }
  
  return res.json({ });
  
});


/* 
 * Returns details for a specific event. Returns an empty object if no event is found.
 */
router.get("/events/:id", checkSchema(validators.detailedEventInputSchema), function(req, res, next) {
  var errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  var event = new dataLayer.DataLayer().getEventById(req.params.id);

  if(event !== undefined) {
    return res.json({ result: event });
  }

  return res.json({ });

});

module.exports = router;
