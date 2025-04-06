import bcrypt from 'bcryptjs';
import Admin from '../Models/adminModel.js';
export const addAdmin = async (req , res) =>{
    try {
        const {id, name , password} = req.body;
        if(!id || !name || !password ) return res.status(404).json({success : false , message : 'Please provide all fields'});
        const hashedPassword = await bcrypt.hash(password , 10);
        const newAdmin = await Admin.create({id, name , password : hashedPassword});
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