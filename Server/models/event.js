const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    flowId: { type: Schema.Types.ObjectId, ref: 'Flow'},
    stageId: { type: Schema.Types.ObjectId, ref: 'Stage'},
    type: {type: String},
    source: {type: String},
    url: {type: String},
    localTimeStamp: {type: Date},
    detail: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
EventSchema.pre('save', next => {
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
const Event = myDB.model('Event', EventSchema);

module.exports = Event;