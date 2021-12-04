const mongoose = require("mongoose");

var mongoDB = "mongodb://localhost/backend";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const sessionSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  SessionName: {
    type: String,
  },
  SessionNumber: {
    type: Number,
    min: 1,
  },
  Episode: { type: [Number], ref: 'Episode' },
});

const session = new mongoose.model("Session", sessionSchema);

module.exports = session;
