const mongoose = require('mongoose');
const { Schema } = mongoose;

const VideoModuleSchema = new Schema({ // ?
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // identificar user
    section: { type: Number, required: true }, // 1 to 6
    percentage: { type: Number, required: true }, // dependiendo del valor de section
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
VideoModuleSchema.pre('save', next => {
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
const VideoModule = myDB.model('VideoModule', VideoModuleSchema);

module.exports = VideoModule;