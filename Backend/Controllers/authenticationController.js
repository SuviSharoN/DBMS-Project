import Credential from '../Models/credentialModel.js';
import bcrypt from 'bcryptjs';

export const validateLogin = async (req, res) => {
  try {
    const { id, password } = req.body;
    console.log(id + password);
    if (!id || !password) {
      return res.status(400).json({ success: false, message: "ID and password are required" });
    }

    const user = await Credential.findOne({ where: { student_id: id } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log("ithuthana    "+password +"\n"+ user.password);
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
