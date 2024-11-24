const express = require("express")
const router = express.Router()
const User = require("../models/user")

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already used" });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();
    res.send("User Register Successfully");
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

   router.post("/login", async (req, res) => {

    const {email, password} = req.body // Extrage email-ul și parola din corpul cererii

    try{
        const user = await User.findOne({email: email, password: password})        
        if(user)
        {
            const temp = {
                name: user.name, 
                email: user.email, //
                isAdmin: user.isAdmin,
                _id: user._id,
            } // Creează un obiect temporar cu datele utilizatorului
            console.log("isAdmin value:", temp.isAdmin);  
            res.send(temp) // Trimite datele utilizatorului găsit
        }
        else{
            return res.status(400).json({message: 'Login failed '})
        }
    }
    catch(error){
        return res.status(400).json({error})
    }

   });

   router.get("/getallusers", async (req, res) => {
    
    try {
       const users = await User.find() // Găsește toate documentele din colecția User
       res.send(users); // Trimite utilizatorii găsiți
     } 
     catch (error) {
       return res.status(500).json({ error: 'Internal server error' });
     }
   });

   router.post('/deleteuser', async (req, res) => {
    const { userid } = req.body;
  
    try {
      await User.findByIdAndDelete(userid);
      res.send('Utilizatorul a fost șters');
    } catch (error) {
      return res.status(400).json({ error });
    }
  });

module.exports=router;