import express from 'express';
import Student from '../models/student.js'; 

const router = express.Router();


router.post('/students/add', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    console.log("Route hit!");
    console.log("Request Body:", req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
