import Enrollment from '../Models/enrollmentModel.js';
export const addEnrollment = async (req , res) =>{
    try {
        const {student_id , course_id , faculty_id , status} = req.body;
        if(!student_id || !course_id || !faculty_id || !status){
            return res.status(404).json({success : false , message: 'Provide all the fields'});
        }
        const newEnrollment = await  Enrollment.create({student_id , course_id , faculty_id, status});
        res.status(200).json({success : true , data : newEnrollment});
    } catch (error) {
        console.log('Error in enrollment' , error);
        res.status(500).json({success : false , message : 'Server Error'});
    }
};

export const getAllEnrollment = async (req, res) =>{
    try {
        const record = await Enrollment.findAll({});
        res.status(200).json({success : true , data : record});
    } catch (error) {
        console.log('Error in fetching Enrollment records');
        res.status(500).json({success : false , message : 'Server Error'});
    }
};

