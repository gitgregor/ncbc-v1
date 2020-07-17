//  Sign Up MongoDB schema in data.js model

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// data base's data structure 
const SignUpSchema = new Schema(
    {
        firstNameMDB: String,
        lastNameMDB: String,
        emailMDB: String,
        passwordMDB: String,
    },
    { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("SignUp", SignUpSchema);