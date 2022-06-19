/** External modules **/
const express = require('express');
const cors = require('cors')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require('config'); //we load the db location from the JSON files
const morgan = require('morgan');
const path = require('path');
require('dotenv').config(); //setup custom environment variables

/** Internal modules **/
const authRoutes = require('./routes/auth');
const confirmationRoutes = require('./routes/confirmation');
const sessionLogRoutes = require('./routes/sessionLog');
const stageRoutes = require('./routes/stage');
const moduleRoutes = require('./routes/module');
const flowRoutes = require('./routes/flow');
const userRoutes = require('./routes/user');
const userFlowRoutes = require('./routes/userFlow');

const userEventRoutes = require('./routes/userEvent')

const imageRoutes = require('./routes/image');
const videoModuleRoutes = require('./routes/videoModule');
const eventsVideoModuleRoutes = require('./routes/EventsVideoModule');
const videoObjectsRoutes = require('./routes/videoObjects');
const quizObjectsRoutes = require('./routes/quizObjects');

const keystrokeRoutes = require('./routes/keystroke');
const mouseClickRoutes = require('./routes/mouseClick');
const mouseCoordinateRoutes = require('./routes/mouseCoordinate');
const ScrollRoutes = require('./routes/scroll');
const EventRoutes = require('./routes/event');

const flowSearchRoutes = require('./routes/flowSearch');
const competencesRoutes = require('./routes/competence');

const Role = require('./models/role');
const Competence = require('./models/competence');

//db connection
//mongoose.connect('mongodb://admin:admin@localhost:27017/neurone-game', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(()=>{
        console.log("Successfully connect to MongoDB.");
        initial();
        //addCompetences();
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

            new Role({
                name: "student"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'student' to roles collection");
            });
        }
    });

}
/*async function addCompetences() {
    const currentCompetences = ['Búsqueda', 'Localización', 'Evaluación Crítica', 'Síntesis', 'Comunicación']
    Competence.estimatedDocumentCount(async (err, count) => {
        if (!err && count === 0) {
            currentCompetences.forEach(element => {
                new Competence({
                    name: element
                }).save(err => {
                    if (err) {
                        console.log("error", err);
                    }
     
                    console.log("added %s to competences collection",element);
                });
            });
        }
   });

}*/

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
app.use('', confirmationRoutes);
app.use('/api/sessionLog', sessionLogRoutes);
app.use('/api/stage', stageRoutes);
app.use('/api/module', moduleRoutes);
app.use('/api/flow', flowRoutes);
app.use('/api/user', userRoutes);
app.use('/api/userFlow', userFlowRoutes);
app.use('/apiTrivia/auth', authRoutes);

app.use('/api/userEvent', userEventRoutes);

app.use('/api/image', imageRoutes);
app.use('/api/videoModule', videoModuleRoutes);
app.use('/api/eventsVideoModule', eventsVideoModuleRoutes);
app.use('/api/videoObjects', videoObjectsRoutes);
app.use('/api/quizObjects', quizObjectsRoutes);

app.use('/api/keystroke', keystrokeRoutes);
app.use('/api/mouseClick', mouseClickRoutes);
app.use('/api/mouseCoordinate', mouseCoordinateRoutes);
app.use('/api/scroll', ScrollRoutes);
app.use('/api/event', EventRoutes);

app.use('/api/flowSearch', flowSearchRoutes);
app.use('/api/competence', competencesRoutes);

// Set client on root

// - Serve static content
app.use(express.static('public'));
// - Serve index
app.get('*',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});


/** Server deployment **/
app.listen(process.env.PORT, () => {
    console.log(`NEURONE-TRAINER listening on the port::${process.env.PORT}`);
});

/** Export APP for testing **/
module.exports = app;
