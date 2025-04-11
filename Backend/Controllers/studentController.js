    import Student from '../Models/studentModel.js';
    import Contact from '../Models/contactModel.js';
    import Academics from '../Models/academicsModel.js';
    import Credential from '../Models/credentialModel.js';
    import Admin from '../Models/adminModel.js';
    import bcrypt from 'bcryptjs';
    
import Faculty from '../Models/facultyModel.js';
//bycrypting password
const createCredential = async (id, password) => {
    try {
      if (!id || !password) {
        throw new Error("ID and password are required");
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newCredential = await Credential.create({
        student_id: id,
        password: hashedPassword,
      });
  
      return newCredential;
    } catch (error) {
      console.error("Error creating credential:", error.message);
      throw error; // rethrow so caller can handle it too
    }
  };
  



    export const addStudent = async (req , res) =>{   
        try {
            const {id , name , email , dob , gender , category , reservation , phone , address , guardian_name , guardian_phone,year,department,joiningyear,password} = req.body;
            if(!id || !name || !email || !dob || !gender || !category || !phone || !address || !password || !year || !department)
                return res.status(400).json({success : false , message : console.log(req.body)});
            const newStudent = await Student.create({id ,name , email , dob , gender , category});
            const newContact = await Contact.create({student_id:id ,  phone , address , guardian_name , guardian_phone});
            const newAcademics = await Academics.create({student_id:id , department , year : year , admission_year:joiningyear});
            const newCredential = await createCredential(id, password);

            res.status(200).json({
                success: true,
                data: { newStudent, newContact, newCredential,newAcademics },
        });
        } catch (error) {
            console.log("Error in creating student", error);
            res.status(500).json({ success: false, message: "Server Error" });
        }
    };
    // export const addCredential = async (req, res) =>{
    //     try {
    //         const {id , password} = req.body;
    //         if(!id || !password) return res.status(404).json({success : false , message : 'Please provide all fields'});
    //         const hashedPassword = await bcrypt.hash(password , 10);
    //         const newCredential = await Credential.create({student_id:id , password : hashedPassword});
    //         res.status(200).json({success : true , data : newCredential});
    //     } catch (error) {
    //         console.log('Error in adding credential' , error);
    //         res.status(500).json({success : false , message : 'Server Error'});
    //     }
    // }
    
    export const getCredential = async (req, res) =>{
        try {
            const {id} = req.params;
            const record = await Credential.findAll({where : {student_id : id}});
            if(record.length === 0) return res.status(404).json({success : false , message : 'No Student found'});
            res.status(200).json({success : true , data : record});
        } catch (error) {
            console.log('Error in fetching credentials');
            res.status(500).json({success : false , message : 'Server Error'});
      }
    }
    
    export const getAcademics =  async (req , res) =>{
        try {
        const {id} = req.params
        const record = await Academics.findAll({where : {student_id : id} });
        if (record.length === 0) {
            return res.status(404).json({ success: false, message: "No academic records found" });
        }
        res.status(200).json({success : true , data : record});
        } catch (error) {
        console.log("Error in fetching academics records " , error);
        res.status(500).json({success : false , message : "Server Error"});
        }
    };

    // export const addAcademics =  async (req , res) =>{
    //     try {
    //     const {id , department , year , admission_year} = req.body;
    //     if(!id || !department || !year || !admission_year) return res.status(400).json({success : false , message : "Please provide all fields"});
    //     const newAcademics = await Academics.create({student_id:id , department , year_of_study : year , admission_year});
    //     res.status(200).json({success : true , data : newAcademics});
    //     } catch (error) {
    //     console.log("Error in inserting academic records " , error);
    //     res.status(500).json({success : false , message : "Server Error"});
    //     }
    // };
    export const rolecheck = async (id) => {
      const newStudent = await Student.findOne({ where: { id } });
      if (newStudent) return { success: true, role: 'Student' };
    
      const newFaculty = await Faculty.findOne({ where: { id } });
      if (newFaculty) return { success: true, role: 'Faculty' };
    
      const newAdmin = await Admin.findOne({ where: { id } });
      if (newAdmin) return { success: true, role: 'Admin' };
    
      return { success: false, message: 'Role not found' };
    };
    

    export const getDashboard = async (req, res) => {
        try {
          const { id } = req.params;
          const validate = await rolecheck(id);
          console.log(validate);
          if(!validate.success){
            res.status(500).json({success : false ,  message : validate.role});
          }
          else if(validate.role === 'Student'){
            try{
              const student = await Student.findByPk(id); 
              const contact = await Contact.findAll(({where : {student_id : id}}));
              const academic = await Academics.findAll(({where : {student_id : id}}));
          
              if (!student) {
                return res.status(404).json({ success: false, message: "Student not found" });
              }
          
              res.status(200).json({ success: true, role: 'Student' , data: {student,contact,academic}});
            }
            catch (error) {
              console.error("Error fetching student dashboard data:", error);
              res.status(500).json({ success: false, message: "Server Error" });
            }
          }

          else if(validate.role === 'Faculty'){
            try {
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
          else {
            try {
              const newAdmin= await Admin.findOne({where : {id}});
              if(!newAdmin){
                return res.status(404).json({ success: false, message: "Faculty not found" });
              }
              res.status(200).json({ success: true, role: 'Admin' , data: {newAdmin}});
            } catch (error) {
              console.error("Error fetching Admin dashboard data:", error);
              res.status(500).json({ success: false, message: "Server Error" });
            }
          }

        }
          catch(error){
            console.log('Error' , error);
          }
      };
      