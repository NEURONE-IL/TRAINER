const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuizObjectsSchema = new Schema({
    video_id: { type: Schema.Types.ObjectId, ref: "VideoObjects" },
    name: { type: String, required: true },
    instructions: { type: String },
    resource_url: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},

    exercises: { type: Array },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
QuizObjectsSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
        this.createdAt = now;
    }
    if(!this.updatedAt) {
        this.updatedAt = now;
    }
    next();
});

const myDB = mongoose.connection.useDb('trainer');
const QuizObjects = myDB.model('QuizObjects', QuizObjectsSchema);

module.exports = QuizObjects;