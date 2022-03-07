const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventsVideoModuleSchema = new Schema({ // ?
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    flowId: { type: Schema.Types.ObjectId, ref: 'Flow', required: true },
    stageId: { type: Schema.Types.ObjectId, ref: 'Stage', required: true },
    component: { type: String, required: true},
    event: { type: String, required: true},
    createdAt: { type: Date, default: Date.now },
});

// Sets the createdAt parameter equal to the current time
EventsVideoModuleSchema.pre('save', next => {
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
const EventsVideoModule = myDB.model('EventsVideoModule', EventsVideoModuleSchema);

module.exports = EventsVideoModule;