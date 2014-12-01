var config = {};

config.name = 'ScoreboardLiveTest';

config.mongoUrl = 'mongodb://127.0.0.1:27017/scoreboardLive';
//config.mongoUrl = 'mongodb://zagrobelny.us:27017/sb';

config.wait = 4000;

config.scoreboardCollectionName = 'scoreboards';

module.exports = config;
