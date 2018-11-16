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