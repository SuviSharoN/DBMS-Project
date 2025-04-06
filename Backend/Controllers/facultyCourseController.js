import facultyCourse from '../Models/facultyCoursesModel.js';
export const addFacultyCourses = async (req , res) =>{
    try {
        const {faculty_id , course_id , seats} = req.body;
        if(!faculty_id || !course_id ) return res.status(400).json({success : false , message : "Please provide all fields"});
 
        const newFacultyCourse = await facultyCourse.create({faculty_id , course_id , available_seats : seats});
        res.status(200).json({success : true , data : newFacultyCourse});
    } catch (error) {
        console.log("Error in inserting facultyCourse records " , error);
        res.status(500).json({success : false , message : "Server Error"});
    }
};

export const getFacultyCourses = async (req , res) =>{
    try {
       const {id} = req.params;
       const record = await  facultyCourse.findAll({where : {faculty_id : id}});
       if (record.length === 0) {
        return res.status(404).json({ success: false, message: "No faculty courses found" });
       }
       res.status(200).json({success : true , data : record});
    } catch (error) {
       console.log("Error in fetching facultyCourse records " , error);
       res.status(500).json({success : false , message : "Server Error"});
    } 
};