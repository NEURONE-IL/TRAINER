//ROOT
process.env.ROOT = 'http://138.197.200.50:3070'

//PORT
process.env.PORT = process.env.PORT || 3070;

//PUBLIC PORT
//process.env.PUBLIC_PORT = 3030;

//token secret
process.env.TOKEN_SECRET = 'bey8asdy89'

//DB
process.env.DB_USER = 'neuroneAdmin';

process.env.DB_PWD = 'DK,V-Dk6-*Pd-PM'
//process.env.URI = `mongodb://localhost:27017`;
process.env.URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@localhost:27017`;
process.env.USERURI = `mongodb://localhost:27017/traineruser`;

//NEURONE GAME CLIENT
process.env.GAME_CLIENT = 'http://159.65.100.191:3030';

// NEURONE DOCS path
process.env.NEURONE_DOCS = '/home/neurone/neuroneAssets'