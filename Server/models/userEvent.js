const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserEventSchema = new Schema({ 
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    flow: { type: Schema.Types.ObjectId, ref: 'Flow', required: true },
    module: { type: Schema.Types.ObjectId, ref: 'Module', default: null },
    stage: { type: Schema.Types.ObjectId, ref: 'Stage', default: null },
    medal: { type: String, default: null },
    eventDescription: { type: String, default: null },
    localTimeStamp: { type: Date, default: null },

    createdAt: { type: Date, default: Date.now },
});

// Sets the createdAt parameter equal to the current time
UserEventSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

const myDB = mongoose.connection.useDb('trainer');
const UserEvent = myDB.model('UserEvent', UserEventSchema);

module.exports = UserEvent;