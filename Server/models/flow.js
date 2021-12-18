const mongoose = require('mongoose');
const { Schema } = mongoose;

const FlowSchema = new Schema({
    name: { type: String, required: true },
    description: {type: String },
    sorted: { type: Boolean, required: true },
    assistant: { type: String },
    image_url: { type: String },
    image_id: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
FlowSchema.pre('save', next => {
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
const Flow = myDB.model('Flow', FlowSchema);

module.exports = Flow;