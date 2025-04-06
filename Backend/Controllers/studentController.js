    import Student from '../Models/studentModel.js';
    import Contact from '../Models/contactModel.js';
    import Academics from '../Models/academicsModel.js';

    export const addStudent = async (req , res) =>{   
        try {
            const {id , name , email , dob , gender , category , reservation , phone , address , guardian_name , guardian_phone} = req.body;
            if(!id || !name || !email || !dob || !gender || !category || !phone || !address)
                return res.status(400).json({success : false , message : console.log(req.body)});
            const newStudent = await Student.create({id ,name , email , dob , gender , category});
            const newContact = await Contact.create({student_id:id ,  phone , address , guardian_name , guardian_phone});
            res.status(200).json({success : true , data :{ newStudent , newContact}});
        } catch (error) {       
            console.log("Error in creating student" , error);
            res.status(500).json({success : false , message : "Server Error"});
        }
    };
    export const addCredential = async (req, res) =>{
        try {
            const {student_id , password} = req.body;
            if(!student_id || !password) return res.status(404).json({success : false , message : 'Please provide all fields'});
            const hashedPassword = await bcrypt.hash(password , 10);
            const newCredential = await Credential.create({student_id , password : hashedPassword});
            res.status(200).json({success : true , data : newCredential});
        } catch (error) {
            console.log('Error in adding credential' , error);
            res.status(500).json({success : false , message : 'Server Error'});
        }
    }
    
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

    export const addAcademics =  async (req , res) =>{
        try {
        const {id , department , year , admission_year} = req.body;
        if(!id || !department || !year || !admission_year) return res.status(400).json({success : false , message : "Please provide all fields"});
        const newAcademics = await Academics.create({student_id:id , department , year_of_study : year , admission_year});
        res.status(200).json({success : true , data : newAcademics});
        } catch (error) {
        console.log("Error in inserting academic records " , error);
        res.status(500).json({success : false , message : "Server Error"});
        }
    };

    export const getDashboard = async (req, res) => {
        try {
          const { id } = req.params;
          console.log(id + "IDDD");
          const student = await Student.findByPk(id); 
          const contact = await Contact.findByPk(id);
      
          if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
          }
      
          res.status(200).json({ success: true, data: student });
        } catch (error) {
          console.error("Error fetching student dashboard data:", error);
          res.status(500).json({ success: false, message: "Server Error" });
        }
      };
      