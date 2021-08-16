const mongoose = require('mongoose');
const { Schema } = mongoose;

const StageSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    step: { type: Number, required: true },
    study: { type: Schema.Types.ObjectId, ref: 'Study', required: true},
    type: { type: String, required: true },
    link: { type: String, required: true },
    active: { type: String, required: true },
    percentage: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
StageSchema.pre('save', next => {
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
const Stage = myDB.model('Stage', StageSchema);

module.exports = Stage;