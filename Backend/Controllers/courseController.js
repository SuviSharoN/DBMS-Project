import Course from '../Models/courseModel.js';
export const addCourse = async (req , res)=>{
    try {
        const { id  , course_name , credits} = req.body;
        if(!id || !course_name || !credits ) return res.status(400).json({success : false , message : "Please provide all fields"});
        const newCourse = await Course.create({id , course_name , credits});
        res.status(200).json({success : true , data : newCourse});
    } catch (error) {
        console.log("Error in inserting course records " , error);
        res.status(500).json({success : false , message : "Server Error"});
    }
};

export const getCourse =  async (req , res) =>{
    try {
       const {id} = req.params
       const record = await Course.findAll({where : {id : id} });
       if (record.length === 0) {
           return res.status(404).json({ success: false, message: "No courses found" });
       }
       res.status(200).json({success : true , data : record});
    } catch (error) {
       console.log("Error in fetching course records " , error);
       res.status(500).json({success : false , message : "Server Error"});
    }
};