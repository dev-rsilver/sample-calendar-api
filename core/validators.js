module.exports.userSchema = {
    username: {
        isLength: {
            options: {
                min: 1,
                max: 250
            }
        },
        isEmpty: false,
        isEmail: false,
        in: ['body']
    },
    password: {
        isLength: {
            options: {
                min: 1,
                max: 250
            }
        },
        isEmpty: false,
        in: ['body']
    }
};

module.exports.eventsInputSchema = {
    startDate: {
        isLength: {
            options: {
                min:1,
                max:250
            }
        },
        in: ['query']
    },
    stopDate: {
        isLength: {
            options: {
                min:1,
                max:250
            }
        },
        in: ['query']
    },
    index: {
        isInt: true,
        in: ['query']
    },
    num: {
        isInt: {
            negated: false,
            options: {
                min:-1,
                max:500
            }
        },
        in: ['query']
    }
};

module.exports.detailedEventInputSchema = {
    id: {
        isLength: {
            options: {
                min:1,
                max:250
            }
        },
        in: ['params']
    }
};