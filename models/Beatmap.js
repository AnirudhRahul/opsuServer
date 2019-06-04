var mongoose = require('mongoose');
var conn = mongoose.createConnection('mongodb://localhost:27017/opsu_Beatmaps', {useNewUrlParser: true});

const schema = new mongoose.Schema({
  username:   String,
  beatmapID:  Number,
  setID:      Number,
  title:      String,
  creator:    String,
  artist:     String,
  version:    String,
  hit300:     Number,
  hit100:     Number,
  hit50:      Number,
  geki:       Number,
  katu:       Number,
  miss:       Number,
  score:      Number,
  combo:      Number,
  perfect:    Boolean,
  mods:       Number,
  time:       Number
}
, {capped: 4*10^10}
);

//Make all fields required
for(var i in schema.paths){
  schema.paths[i].required(true);
}

schema.index({ beatmapID: 1, score: -1, username: 1 }); // schema level



module.exports = conn.model('Beatmap', schema);
