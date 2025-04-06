import  Student  from "../Models/studentModel.js";
import bcrypt from "bcryptjs";
import Credential from "../Models/credentialModel.js";
export const validateLogin = async (req, res) => {
  try {
    const { id, password } = req.body;
    console.log("\n" + id +'\n' + password);
    // Check if user exists
    const user = await Credential.findOne({ where: { student_id:id} });
    console.log(user.password);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Entered:", password, "\nStored:", user.password);
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // If matched
    return res.status(200).json({ success: true, message: "Login successful" });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
