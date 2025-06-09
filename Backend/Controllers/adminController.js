// Handles admin user management and dashboard functionality
// Provides CRUD operations for admin accounts with secure password handling
import bcrypt from 'bcryptjs';
import Admin from '../Models/adminModel.js';

export const addAdmin = async (req , res) =>{
    try {
        const {id, name , email , password} = req.body;
        if(!id || !name || !email ||  !password ) return res.status(404).json({success : false , message : 'Please provide all fields'});
        const hashedPassword = await bcrypt.hash(password , 10);
        const newAdmin = await Admin.create({id, name , email , password : hashedPassword});
        res.status(200).json({success : true , data : newAdmin});
    } catch (error) {
        console.log('Error in inserting admin records' , error);
        res.status(500).json({success : false , message : 'Server Error'});
    }
}

export const getAdmin = async (req ,res )=>{
    try {
        const {id} = req.params;
        const record = await Admin.findAll({where : {id}});
        if(record.length === 0) return res.status(404).json({success : false , message : 'No admin found'});
        res.status(200).json({success : true , data : record});
    } catch (error) {
        console.log('Error in fetching admin records' , error);
        res.status(500).json({success : false , message : 'Server Error'});
    }
};

export const getAdminDashboard = async (req, res) =>{
    try {
        const {id} = req.params;
        const newAdmin= await Admin.findOne({where : {id}});
        if(!newAdmin){
          return res.status(404).json({ success: false, message: "Admin not found" });
        }
        res.status(200).json({ success: true, role: 'Admin' , data: {newAdmin}});
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        res.status(500).json({ success: false, message: "Server Error" });
      }
}