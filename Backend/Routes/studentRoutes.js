import express from 'express';
import { addStudent, getAcademics, getDashboard, getCredential } from '../Controllers/studentController.js';
import { authMiddleware } from '../MiddleWare/authMiddleWare.js';
import Student from '../Models/studentModel.js';

const router = express.Router();

// Get all students (admin only)
router.get('/all', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Only administrators can view all students' });
        }

        const students = await Student.findAll({
            attributes: ['id', 'name', 'email'],
            order: [['name', 'ASC']]
        });

        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Error fetching students' });
    }
});

router.post('/', addStudent);
router.get('/dashboard/:id', getDashboard);
router.get('/academics/:id', getAcademics);

export default router;