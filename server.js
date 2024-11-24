const express = require("express");

const app = express();


//Configurare Baza de date
const dbConfig = require('./db')
//Importare rute
const groundsRoute= require('./routes/groundsRoute')
const usersRoute = require('./routes/usersRoute')
const bookingsRoute = require('./routes/bookingsRoute')
app.use(express.json())

//Configurare rute
app.use('/api/terens', groundsRoute)
app.use('/api/users', usersRoute)
app.use('/api/bookings', bookingsRoute)

//Setarea portului si Pornirea serverului
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Node Server Started using nodemon"));
