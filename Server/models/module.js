const mongoose = require('mongoose');
const { Schema } = mongoose;

const ModuleSchema = new Schema({
    study: { type: Schema.Types.ObjectId, ref: 'Study', required: true},
    name: { type: String, required: true },
    description: {type: String },
    code: {type: String},
    image_url: { type: String },
    image_id: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
ModuleSchema.pre('save', next => {
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
const Module = myDB.model('Module', ModuleSchema);

module.exports = Module;