// models/User.js
const { mongoose } = require("../../constants");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
    },
    imageUrl: {
        type: String,
    },
    bio: {
        type: String,
    },
    authToken: {
        type: String,
    },
    isTick: {
        type: Boolean,
        required: true,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    loginTime: {
        type: Date,
    },
    resetPasswordToken:{
        type:String
    }
},
    {
        timestamps: true, 
    });

module.exports = mongoose.model("User", userSchema);
