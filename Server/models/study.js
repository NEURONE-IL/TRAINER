const mongoose = require('mongoose');
const { Schema } = mongoose;

const StudySchema = new Schema({
    name: { type: String, required: true },
    description: {type: String },
    domain: { type: String },
    type: { type: String, required: true },
    image_url: { type: String },
    image_id: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
StudySchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

const myDB = mongoose.connection.useDb('neuronegame');
const Study = myDB.model('Study', StudySchema);

module.exports = Study;