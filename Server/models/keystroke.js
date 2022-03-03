const mongoose = require('mongoose');
const { Schema } = mongoose;

const KeystrokeSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    flowId: { type: Schema.Types.ObjectId, ref: 'Flow'},
    stageId: { type: Schema.Types.ObjectId, ref: 'Stage'},
    type: {type: String},
    source: {type: String},
    url: {type: String},
    which: {type: Number},
    keyCode: {type: Number},
    charCode: {type: Number},
    key: {type: String},
    chr: {type: String},
    localTimeStamp: {type: Date},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
KeystrokeSchema.pre('save', next => {
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
const KeyStroke = myDB.model('KeyStroke', KeystrokeSchema);

module.exports = KeyStroke;