const mongoose = require('mongoose');
const { Schema } = mongoose;

const FlowSchema = new Schema({
    name: { type: String, required: true },
    description: {type: String },
    sorted: { type: Boolean, required: true },
    image_url: { type: String },
    image_id: { type: String },

    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    collaborators:[{
      user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
      invitation: {type: String, default: 'Pendiente'}
      }],
    privacy: {type: Boolean, default: true},
    type: {type: String, default: 'own'},
    tags: {type: [String]},
    levels: {type:[String], required:true},
    competences: {type: [{ type: Schema.Types.ObjectId, ref: 'Competence'}], required:true},
    language: { type: Schema.Types.ObjectId, ref: 'Language', required: true},
    edit: {type: [String], default: []},
    
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