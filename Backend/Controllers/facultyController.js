import Faculty from '../Models/facultyModel.js';
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