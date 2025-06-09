// Handles faculty management and dashboard functionality
// Provides CRUD operations and course management for faculty members
import Faculty from '../Models/facultyModel.js';
import Course from '../Models/courseModel.js';
import facultyCourse from '../Models/facultyCoursesModel.js';
import bcrypt from 'bcryptjs';

export const addFaculty =  async (req , res) =>{
    try {
        const {id , name , email , department , password} = req.body;
        if(!id || !name || !email || !department || !password )  return res.status(400).json({success : false , message : "Please provide all fields"});
        const hashedPassword = await bcrypt.hash(password, 10);
        const newFaculty = await Faculty.create({id , name , email , department, password : hashedPassword });
        res.status(200).json({success : true , data : newFaculty});
    } catch (error) {
        console.log("Error in inserting faculty records " , error);
        res.status(500).json({success : false , message : "Server Error"});
    }
};

export const getFaculty = async (req , res) =>{
    try {
        const {id} = req.params
        const record = await Faculty.findAll({where : {id : id} });
        if (record.length === 0) {
            return res.status(404).json({ success: false, message: "No faculty records found" });
        }
        res.status(200).json({success : true , data : record});
     } catch (error) {
        console.log("Error in fetching faculty  records " , error);
        res.status(500).json({success : false , message : "Server Error"});
     }
};

export const getAllFaculties = async (req, res) => {
    try {
        const faculties = await Faculty.findAll({
             attributes: ['id', 'name'], // Only send needed info
             order: [['name', 'ASC']]
         });
        res.status(200).json({ success: true, data: faculties });
    } catch (error) {
        console.error("Error fetching faculties:", error);
        res.status(500).json({ success: false, message: 'Server Error fetching faculties.', error: error.message });
    }
};

export const getFacultyDashboard = async (req , res) =>{
    try {
        const {id} = req.params;
        const newFaculty= await Faculty.findOne({where : {id}});
        if(!newFaculty){
          return res.status(404).json({ success: false, message: "Faculty not found" });
        }
        res.status(200).json({ success: true, role: 'Faculty' , data: {newFaculty}});
      } catch (error) {
        console.error("Error fetching faculty dashboard data:", error);
        res.status(500).json({ success: false, message: "Server Error" });
      }
}

export const getMyCourses = async (req, res) => {
    try {
        const facultyId = req.user.id; // Get faculty ID from auth middleware
        console.log(`======> Executing getMyCourses for Faculty ID: ${req.user?.id} <======`);
        // Find the faculty and include their associated courses through the join table
        const facultyWithCourses = await Faculty.findByPk(facultyId, {
            // We want to fetch the courses linked via the facultyCourse table
            include: [{
                model: Course, // Include the Course model
                attributes: ['id', 'course_name'], // Select only needed course fields
                through: {
                    model: facultyCourse, // Specify the join table
                    attributes: [] // Don't need attributes from the join table itself in the final result
                }
            }]
        });

        if (!facultyWithCourses) {
            // Should not happen if token is valid, but good check
            return res.status(404).json({ message: "Faculty not found." });
        }

        // The associated courses will be in facultyWithCourses.Courses
        const courses = facultyWithCourses.Courses || [];

        res.status(200).json(courses); // Send the array of courses

    } catch (error) {
        console.error("Error fetching faculty's courses:", error);
        res.status(500).json({ message: "Server error fetching courses." });
    }
}