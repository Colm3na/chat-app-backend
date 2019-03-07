const User = require('../schemas');

module.exports = {
    createUser(req, res) {
        let user = req.body;
        console.log(user);
        User.create({user}, (err) => {
            if (!err) {
                console.log('user succesfully registered!');
            }
        })
    }
};