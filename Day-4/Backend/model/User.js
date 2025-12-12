const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// USER SCHEMA
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// FOOD SCHEMA
const FoodSchema = new Schema({
    name: { type: String, required: true },
    daysSinceIAte: { type: Number, required: true },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Food = mongoose.model('Food', FoodSchema);

// EXPORT BOTH MODELS
module.exports = {
    User,
    Food
};
