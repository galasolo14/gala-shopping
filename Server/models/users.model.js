const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    city: String,
    street: String,
    email: String,
    password: String,
    isAdmin: Boolean,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = userSchema;
