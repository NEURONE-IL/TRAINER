const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserFlowSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    flow: { type: Schema.Types.ObjectId, ref: 'Flow', required: true},
    assent: {type: Boolean, default: false},
    finished: {type: Boolean, default: false},
    finishedAt: { type: Date},
    modules: {
        type: [{
            module: {type: Schema.Types.ObjectId, ref: 'Module'},
            completed: { type: Boolean, default: false },
            startedAt: { type: Date},
            completedAt: { type: Date},
            stages: { type: [{
                stage: {type: Schema.Types.ObjectId, ref: 'Stage'},
                percentage: { type: Number, required: true, default: 0 },
                active: { type: Boolean, default: false },
                completed: { type: Boolean, default: false },
                startedAt: { type: Date},
                lastEntry: { type: Date},
                completedAt: { type: Date},
                _id: false,
                id: false
              }], default: []},
            _id: false,
            id: false
          }], default: []
    },
    lastStagePlayed: {type: Schema.Types.ObjectId, ref: 'Stage', default: null},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
UserFlowSchema.pre('save', next => {
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
const UserFlow = myDB.model('UserFlow', UserFlowSchema);

module.exports = UserFlow;