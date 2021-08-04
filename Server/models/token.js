const mongoose = require('mongoose');
const { Schema } = mongoose;

const TokenSchema = new Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

const myDB = mongoose.connection.useDb('trainer');
const Token = myDB.model('Token', TokenSchema);

module.exports = Token;