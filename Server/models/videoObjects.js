const mongoose = require('mongoose');
const { Schema } = mongoose;

const VideoObjectsSchema = new Schema({
    name: { type: String },
    _id: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
    quiz_id: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    image_url: { type: String, required: true },
    video_url: { type: String, required: true },
    language: { type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
VideoObjectsSchema.pre('save', next => {
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
const VideoObjects = myDB.model('VideoObjects', VideoObjectsSchema);

module.exports = VideoObjects;