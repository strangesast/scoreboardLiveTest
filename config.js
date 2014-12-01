var config = {};

config.name = 'ScoreboardLiveTest';

config.mongoUrl = 'mongodb://zagrobelny.us:27017/scoreboardLive';
//config.mongoUrl = 'mongodb://zagrobelny.us:27017/sb';

config.pixelSize = 20;
config.wait = 4000;

config.scoreboardCollectionName = 'scoreboards';

module.exports = config;
