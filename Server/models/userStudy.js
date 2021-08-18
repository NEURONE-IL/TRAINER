const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserStudySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    study: { type: Schema.Types.ObjectId, ref: 'Study', required: true},
    assent: {type: Boolean, default: false},
    finished: {type: Boolean, default: false},
    finishedAt: { type: Date},
    stages: { type: [{
        stage: {type: Schema.Types.ObjectId, ref: 'Stage'},
        percentage: { type: Number, required: true, default: 0 },
        _id: false,
        id: false
      }], default: []},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
UserStudySchema.pre('save', next => {
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
const UserStudy = myDB.model('UserStudy', UserStudySchema);

module.exports = UserStudy;