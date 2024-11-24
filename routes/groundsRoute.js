const express = require("express")
const router = express.Router()

const Teren = require('../models/teren')

//Ruta pentru obtinerea tuturor terenurilor
router.get("/getallgrounds", async (req, res) => {
    try {
      const terenuri = await Teren.find({}); // Găsește toate documentele din colecția Teren

      if (terenuri.length === 0) {
        return res.status(404).json({ message: 'No documents found' }); // Verifică dacă nu s-au găsit documente
    }
      res.send(terenuri); // Trimite terenurile găsite
    } catch (error) {
      console.error('Error fetching terenuri:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  //Ruta pentru obtinerea terenului dupa ID
  router.post("/getgroundbyid", async (req, res) => {
    const terenid= req.body.terenid // Extrage ID-ul terenului din corpul cererii
    try {
       const teren = await Teren.findOne({_id: terenid}); // Găsește terenul specificat după ID
 
       if (teren.length === 0) {
         return res.status(404).json({ message: 'No documents found' }); // Verifică dacă terenul nu a fost găsit
     }
       res.send(teren); // Trimite terenul găsit
     } catch (error) {
       console.error('Error fetching terenuri:', error);
       return res.status(500).json({ error: 'Internal server error' });
     }
   });

  //Ruta pentru Adăugarea unui Nou Teren
   router.post("/addground", async(req,res)=>{
    console.log(req.body); 
    try {
     
      const newground = new Teren(req.body)
      await newground.save()

      res.send('Teren nou adaugat cu succes')
    } catch (error) {
      return res.status(400).json({error});
    }
   });

   router.post("/deleteground", async (req, res) => {
    const { groundid } = req.body;
  
    try {
      await Teren.findByIdAndDelete(groundid);
      res.send('Terenul a fost șters');
    } catch (error) {
      return res.status(400).json({ error });
    }
  });
  

module.exports=router;
