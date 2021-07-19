const { any, boolean } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    names: { type: String },
    last_names: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true }
});

// Sets the createdAt parameter equal to the current time
UserSchema.pre('save', next => {
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
const User = myDB.model('User', UserSchema);

module.exports = User;