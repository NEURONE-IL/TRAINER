/** External modules **/
const express = require('express');
const cors = require('cors')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require('config'); //we load the db location from the JSON files
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config(); //setup custom environment variables

/** Internal modules **/
require('./config/config');
const authRoutes = require('./routes/auth');

const Role = require('./models/role');
const User = require('./models/user');


//db connection

//mongoose.connect('mongodb://admin:admin@localhost:27017/neurone-game', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(()=>{
        console.log("Successfully connect to MongoDB.");
        initial();
    });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


async function initial() {
     Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });

}

/** Express setup **/
const app = express();
app.use(cors())

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

/** Express routing **/
app.use('/api/auth', authRoutes);

// Set client on root

// - Serve static content
app.use(express.static('public'));
// - Serve index
app.get('*',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});


/** Server deployment **/
app.listen(process.env.PORT, () => {
    console.log(`NEURONE-GAME listening on the port::${process.env.PORT}`);
});

/** Export APP for testing **/
module.exports = app;