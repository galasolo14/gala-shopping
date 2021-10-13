const mongoose = require('mongoose');
const userSchema = require('../models/users.model');
const User = mongoose.model('User', userSchema);
const {createHashedPassword} = require('../utils/index');

const fetchUser = async ({ username, password }) => {
    const hashedPassword  = createHashedPassword(password);
    return await User.findOne({ username, hashedPassword });
}

const addUser = async ({ user }) => {
    const {firstName, lastName, city, street, email, password } = user;
    user.password  = createHashedPassword(user.password);
    const newUser = new User({ 
        firstName, 
        lastName, 
        city, 
        street, 
        email, 
        password: user.password,
        isAdmin: false 
    });
    return await newUser.save();
}

const userExist = async ({ user }) => {
    const { email } = user;
    const isUser = await User.findOne({ email });
    return isUser;
}

module.exports = { fetchUser, addUser, userExist };