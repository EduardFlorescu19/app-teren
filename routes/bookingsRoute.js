const express = require("express")
const router = express.Router()
const Ground = require("../models/teren")
const Booking = require("../models/booking")
const stripe = require('stripe')('sk_test_51PBGwR09WyPDp1q7TWZxsNNjSSvSw3GTLpAkz61AhIao3yHOGPhvEQyEDbId9P6H1InOMXHEEyY5vcSEpl2p2KA000FZciENR0')
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
require('dotenv').config();
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
  }
});

const generatePDF = (bookingDetails, filePath) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('Factura', {
      align: 'center'
  });

  doc.moveDown();
  doc.fontSize(14).text(`ID rezervare: ${bookingDetails.bookingId}`);
  doc.text(`Teren: ${bookingDetails.ground}`);
  doc.text(`Data: ${bookingDetails.selectedDate}`);
  doc.text(`De la ora: ${bookingDetails.fromtime}`);
  doc.text(`La ora: ${bookingDetails.totime}`);
  doc.text(`Suma totala: ${bookingDetails.totalamount} RON`);
  doc.text(`Status: ${bookingDetails.status}`);

  doc.end();
};

//Ruta pentru rezervare
router.post("/bookground", async (req, res) => {
  const { totalamount, token } = req.body // Extrage suma totală și token-ul din corpul cererii

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    }) // Creează un client Stripe cu emailul și sursa de plată

    const payment = await stripe.charges.create(

      {
        amount: totalamount * 100,
        customer: customer.id,
        currency: "RON",
        receipt_email: token.email

      }, {
      idempotencyKey: uuidv4()
    } // Creează o plată cu Stripe

    )

    if (payment) {
     
        const booking = new Booking(req.body); // Creează o nouă rezervare cu datele din corpul cererii
        await booking.save(); // Salvează rezervarea în baza de date

        const ground = await Ground.findById(req.body.groundid);
        if (!ground) {
          return res.status(404).json({ message: "Terenul nu a fost gasit" }) // Verifică dacă terenul există
        }
        ground.currentbookings.push(booking) // Adaugă rezervarea la rezervările curente ale terenului
        await ground.save() // Salvează modificările terenului
      
        const bookingDetails = {
          bookingId: booking._id,
          ground: ground.name,
          selectedDate: req.body.selectedDate,
          fromtime: req.body.fromtime,
          totime: req.body.totime,
          totalamount: totalamount,
          status: "Rezervat"
        };
        const filePath = `receipts/receipt_${booking._id}.pdf`;
        generatePDF(bookingDetails, filePath);

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: token.email,
          subject: 'Confirmare Rezervare Teren Sport',
          text: `Felicitari! Rezervarea terenului ${ground.name} a fost efectuata cu succes pentru data de ${req.body.selectedDate} de la ora ${req.body.fromtime} pana la ora ${req.body.totime}. Suma totala este ${totalamount} RON.`,
          attachments: [
            {
              filename: `receipt_${booking._id}.pdf`,
              path: filePath
            }
          ]
        };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email: ", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.send("Plata Reusita, Teren rezervat") // Trimite mesaj de succes
    }
   } catch (error) {
    return res.status(400).json({ error }) // Trimite mesaj de eroare în caz de eșec

  }

})
//Stergerea unei rezervari dupa ID-ul rezervarii
router.post("/deletebooking", async (req, res) => {
  const { bookingid } = req.body;

  try {
    await Booking.findByIdAndDelete(bookingid);
    res.send('Rezervarea a fost ștearsă');
  } catch (error) {
    return res.status(400).json({ error });
  }
});

//Obtinerea rezervarilor dupa ID-ul utilizatorului
router.post("/getbookingsbyid", async(req,res) => {
  const userid= req.body.userid // Extrage ID-ul utilizatorului din corpul cererii
  try {
    const bookings = await Booking.find({userid : userid}) // Găsește toate rezervările pentru utilizatorul specificat
    res.send(bookings) // Trimite rezervările găsite
  } catch (error) {
    return res.status(400).json({error}) // Trimite mesaj de eroare în caz de eșec
  }
})

//Anularea unei rezervari
router.post("/cancelbooking", async(req,res) => {
  const {bookingid, groundid} = req.body

  try {
    const bookingitem = await Booking.findOne({_id : bookingid})

    bookingitem.status = 'Anulat'
    await bookingitem.save()
    const ground = await Ground.findOne({_id : groundid}) // Găsește terenul specificat
    const bookings = ground.currentbookings // Obține rezervările curente ale terenului

    const temp = bookings.filter(booking => booking._id.toString()!=bookingid) // Filtrează rezervările pentru a exclude rezervarea anulată
    ground.currentbookings=temp // Actualizează rezervările curente ale terenului

    await ground.save()

    res.send("Rezervare anulata cu succes")
  } catch (error) {
    return res.status(400).json({error})
  }
})

//Obtinerea tuturor rezervarilor
router.get("/getallbookings", async(req,res) => {
 
  try {
    const bookings = await Booking.find()
    res.send(bookings)
  } catch (error) {
    return res.status(400).json({error})
  }
})


module.exports = router
