// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const FoodModel = require('./models/Food');

const app = express();
const port = process.env.PORT || 3001;
const mongoUri = process.env.uri || process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    if (!mongoUri) {
      throw new Error('MongoDB connection string missing. Set uri or MONGO_URI in .env');
    }

    // NOTE: Do NOT pass useNewUrlParser/useUnifiedTopology with modern mongoose versions.
    await mongoose.connect(mongoUri); // keep it simple

    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (err) {
    // Print full error (helps debugging)
    console.error('Failed to connect to MongoDB:', err && err.message ? err.message : err);
    process.exit(1); // stop so nodemon shows crash and you fix it
  }
}
startServer();

/* ---------- Routes (same as before) ---------- */

// Create
app.post('/insert', async (req, res) => {
  const { foodName, daysSinceIAte } = req.body;

  if (!foodName || typeof daysSinceIAte === 'undefined') {
    return res.status(400).json({ error: 'foodName and daysSinceIAte are required' });
  }

  const food = new FoodModel({ foodName, daysSinceIAte });

  try {
    const saved = await food.save();
    res.status(201).json({ message: 'Food item inserted', item: saved });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Error inserting food item' });
  }
});

// Read all
app.get('/read', async (req, res) => {
  try {
    const foods = await FoodModel.find({});
    res.status(200).json(foods);
  } catch (error) {
    console.error('Read error:', error);
    res.status(500).json({ error: 'Error reading food items' });
  }
});

// Update by id
app.put('/update', async (req, res) => {
  const { newFoodName, daysSinceIAte } = req.body;
  const id = req.params.id;

  if (!newFoodName && typeof daysSinceIAte === 'undefined') {
    return res.status(400).json({ error: 'Provide newFoodName or daysSinceIAte to update' });
  }

  const updatePayload = {};
  if (newFoodName) updatePayload.foodName = newFoodName;
  if (typeof daysSinceIAte !== 'undefined') updatePayload.daysSinceIAte = daysSinceIAte;

  try {
    const updated = await FoodModel.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!updated) return res.status(404).json({ error: 'Food item not found' });
    res.status(200).json({ message: 'Food item updated', item: updated });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Error updating food item' });
  }
});

// Delete by id
app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const removed = await FoodModel.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ error: 'Food item not found' });
    res.status(200).json({ message: 'Food item deleted', item: removed });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Error deleting food item' });
  }
});
