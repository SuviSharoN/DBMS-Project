import bcrypt from "bcryptjs";
import Credential from "../Models/credentialModel.js";
import Faculty from "../Models/facultyModel.js";
import Admin from "../Models/adminModel.js";
export const validateLogin = async (req, res) => {
  try {
    const { id, password } = req.body;
    console.log("\n" + id +'\n' + password);
    // Check if user exists
    const user = await Credential.findOne({ where: { student_id:id} });
    const facultyUser = await Faculty.findOne({where : {id}});
    const adminUser = await Admin.findOne({where : {id}});
   /* if(user) console.log(user.password);
    if(facultyUser) console.log(facultyUser.password);
    if(adminUser)   console.log(adminUser.password);*/
    if (!user && !facultyUser && !adminUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    // Compare password
    let isMatchStudent = false;
    if(user) isMatchStudent = await bcrypt.compare(password, user.password);
    let isMatchFaculty= false;
    if(facultyUser) isMatchFaculty = await bcrypt.compare(password , facultyUser.password);
    let isMatchAdmin = false;
    if(adminUser) isMatchAdmin = await bcrypt.compare(password , adminUser.password);
    if (!isMatchStudent && !isMatchFaculty && !isMatchAdmin) {
      console.log("Entered:", password, "\nStored:", user.password);
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // If matched
    if(isMatchStudent) return res.status(200).json({ success: true, role : 'Student',  message: "Login successful" });
    else if (isMatchFaculty) return res.status(200).json({ success: true, role : 'Faculty',  message: "Login successful" });
    else return res.status(200).json({ success: true, role : 'Admin',  message: "Login successful" });
 

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
