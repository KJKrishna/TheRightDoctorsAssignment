import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://jyothikrishna0407:tKzA0C2U38OC1ouS@cluster0.fy1by.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Person Schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  mobileNumber: { type: String, required: true }
});

const Person = mongoose.model('Person', personSchema);

// Routes
// GET all persons
app.get('/person', async (req, res) => {
  try {
    const persons = await Person.find();
    res.json(persons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new person
app.post('/person', async (req, res) => {
  const person = new Person({
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    mobileNumber: req.body.mobileNumber
  });

  try {
    const newPerson = await person.save();
    res.status(201).json(newPerson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update person
app.put('/person/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (person) {
      person.name = req.body.name || person.name;
      person.age = req.body.age || person.age;
      person.gender = req.body.gender || person.gender;
      person.mobileNumber = req.body.mobileNumber || person.mobileNumber;
      
      const updatedPerson = await person.save();
      res.json(updatedPerson);
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE person
app.delete('/person/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (person) {
      await person.deleteOne();
      res.json({ message: 'Person deleted' });
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});