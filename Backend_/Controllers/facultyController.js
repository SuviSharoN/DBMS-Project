import Faculty from '../Models/facultyModel';
export const addFaculty =  async (req , res) =>{
    try {
        const {id , name , email , department} = req.body;
        if(!id || !name || !email || !department)  return res.status(400).json({success : false , message : "Please provide all fields"});

        const newFaculty = await Faculty.create({id , name , email , department});
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