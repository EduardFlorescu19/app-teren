const mongoose = require("mongoose");
const Teren = require("./models/teren");
const mongoURL = 'mongodb+srv://user12:parola@atlascluster.xej0zxd.mongodb.net/terenuri';

//Conectare la MongoDB
mongoose.connect(mongoURL)
  .then(() => {
    console.log('Mongo DB Connection Successful');
  })
  .catch((error) => {
    console.error('Mongo DB connection failed:', error);
  });

const connection = mongoose.connection;

//Eveniment deconectare
connection.on('disconnected', () => {
  console.log('Mongo DB Connection Disconnected');
});

module.exports = mongoose;
