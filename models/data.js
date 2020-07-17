
//  Schema fro data  in MongoDB. data.js model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// data base's data structure 
const DataSchema = new Schema(
    {
        id: Number,
        message: String,
        em: String,
        uspass: String,
        uid: Number,
    },
    { timestamps: true }
);

// export the new Schema for the reason to modify data by node
module.exports = mongoose.model("Data", DataSchema);