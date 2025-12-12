const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { User, Food } = require('./model/User');

// Middlewares
app.use(bodyParser.json());
app.use(cors());


// PORT
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.uri).then(() => {
  console.log("Connected to the database");
})
.catch((err) => {
  console.log("Cannot connect to the database", err);
  process.exit();
});

// Register API
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed", details: error });
  }
});
app.post('/api/login',async(req,res)=>{

  try{
    const {name,password}=req.body;
    const user=await User.findOne({name});
    if(!user){
      return res.status(400).json({message:'Invalid credentials'});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({message:'Invalid credentials'});
    }
    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.json({token});
  }catch(error){
    res.status(500).json({error:error.message});
  }
}); 
//Middleware to verify token
//Middleware before sending the res ,i need to check if the token is valid or not

function authenticateToken(req,res,next){
  const authHeader=req.headers['authorization'];
  const token=authHeader && authHeader.split(' ')[1];
  if(token==null)return res.sendStatus(401);
}

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "A token is required for authentication" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    req.userId = decoded.userId;
    next();
  });
};
app.post('/api/food', verifyToken, async (req, res) => {
  try {
    const { name, daysSinceIAte } = req.body;

    const food = new Food({
      name,
      daysSinceIAte,
      user: req.userId
    });

    await food.save();
    res.json({ message: "Food item added successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Food
app.get('/api/food', verifyToken, async (req, res) => {
  try {
    const foodList = await Food.find({ user: req.userId });
    res.json(foodList);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
