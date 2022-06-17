const mongoose = require('mongoose');
const { Schema } = mongoose;

const FlowSearchSchema = new Schema({
    name: { type: String, required: true},
    description: { type: String},
    //challenges: {type: [String]},
    tags: {type: [String]},
    author: { type: String},
    userID:{type: String},
    flow: { type: Schema.Types.ObjectId, ref: 'Flow', required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
FlowSearchSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

FlowSearchSchema.index({name:'text', description: 'text', tags: 'text', author: 'text'},
                        {default_language: "spanish" })

const myDB = mongoose.connection.useDb('trainer');
const FlowSearch = myDB.model('FlowSearch', FlowSearchSchema);

module.exports = FlowSearch;