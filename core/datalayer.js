
/**
 * Simulates database access.
 */
module.exports.DataLayer = function() {

    /**
     * Returns the specified number of events between the start and stop dates. Events that are restricted to
     * a specific user and events that are global to all users (no userId specified) will be returned.
     * 
     * @param {string} startDate Starting date of date range, e.g. "11/16/2018 12:00 PM"
     * @param {string} stopDate Stopping date of date range, e.g. "11/16/2018 2:00 PM"
     * @param {number} index The zero-based index from which to start retrieving entries
     * @param {number} num The total number of entries to retrieve, or -1 for all entries starting from index
     */
    this.getEventsByDate = function(userId, startDate, stopDate, index, num) {
        
        var start = Date.parse(startDate);
        var stop = Date.parse(stopDate);

        if(isNaN(start)) {
            throw new Error("startDate is invalid.");
        }

        if(isNaN(stop)) {
            throw new Error("stopDate is invalid.");
        }

        var events = [];
        for(var i = 0; i < eventData.length; i++) {
            if(eventData[i].startDate >= start && eventData[i].stopDate <= stop && //within date range
               (eventData[i].userId === undefined || //event is global
               (eventData[i].userId !== undefined && userId !== undefined && eventData[i].userId.toLowerCase() === userId.toLowerCase()))) { //event is user specific, a user has been specified, and they match
                events.push({ 
                    id: eventData[i].id, 
                    title: eventData[i].title, 
                    startDate: eventData[i].startDate, 
                    stopDate: eventData[i].stopDate,
                    userId: eventData[i].userId 
                });
            }
        }

        
        if(events.length > 0 && index > events.length - 1) {
            throw new Error("Out of range.");
        }

        var total = num;

        if(num < 0) {
            total = eventData.length - index;
        }

        return events.splice(index, total);
    }

    /**
     * Returns an event or undefined if an event with the specified id does not exist.
     */
    this.getEventById = function(id) {

        for(var i = 0; i < eventData.length; i++) {
            if(eventData[i].id.toLowerCase() == id.toLowerCase()) {
                return { 
                    id: eventData[i].id, 
                    title: eventData[i].title, 
                    description: eventData[i].description, 
                    startDate: eventData[i].startDate, 
                    stopDate: eventData[i].stopDate 
                };
            }
        }

        return undefined;
    }

    /** 
     * Adds an event.
     * @param {string} startDate Provide in standard date format, e.g. "11/16/2018 12:00 PM"
     * @param {string} stopDate Provide in standard date format, e.g. "11/16/2018 12:00 PM"
     * @param {string} userId Event will only be returned for the specified user. An event with an undefined userId will be returned for all users.
    */
    function addEvent(id, title, description, startDate, stopDate, userId) {
        
        var start = Date.parse(startDate);
        var stop = Date.parse(stopDate);

        if(isNaN(start)) {
            throw new Error("startDate is invalid.");
        }

        if(isNaN(stop)) {
            throw new Error("stopDate is invalid.");
        }

        eventData.push({ id: id, title: title, description: description, startDate:start, stopDate:stop, userId:userId });
    }

    eventData = [];

    //Initialize with some events.
    addEvent("110293", "Global Test Event", "This is a test event description for a global event.", "11/16/2018 12:00 PM", "11/16/2018 2:00 PM");
    addEvent("110295", "Thanksgiving", "It's a Thanksgiving holiday!", "11/22/2018 0:00:00", "11/22/2018 23:59:59");
    addEvent("110294", "User specific event", "This is a test event description for a user event.", "11/16/2018 12:00 PM", "11/16/2018 2:00 PM", process.env.DEMO_USER_ID);
    addEvent("110296", "A Multiday Event", "This is a multiday event", "11/28/2018 12:00 PM", "11/29/2018 12:00 PM");

}