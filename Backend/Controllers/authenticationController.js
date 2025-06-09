// Handles user authentication and JWT token generation
// Provides role-based login validation across student, faculty, and admin users
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'; // Import jwt
import Credential from "../Models/credentialModel.js";
import Faculty from "../Models/facultyModel.js";
import Admin from "../Models/adminModel.js";

// Ensure dotenv is configured early, typically in server.js, but check if needed here
// import dotenv from 'dotenv';
// dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
    process.exit(1); // Exit if secret is missing
}

export const validateLogin = async (req, res) => {
    try {
        const { id, password } = req.body;
        console.log("\nLogin attempt for ID:", id);

        let actualUserId = null;
        let userRecord = null;
        let userRole = null;
        let storedPassword = null;

        // Find user across tables
        const studentUser = await Credential.findOne({ where: { student_id: id } });
        if (studentUser) {
            
            userRecord = studentUser;
            userRole = 'Student';
            storedPassword = studentUser.password;
            actualUserId = studentUser.student_id
        } else {
            const facultyUser = await Faculty.findOne({ where: { id } });
            if (facultyUser) {
                userRecord = facultyUser;
                userRole = 'Faculty';
                storedPassword = facultyUser.password;
                actualUserId = facultyUser.id;
            } else {
                const adminUser = await Admin.findOne({ where: { id } });
                if (adminUser) {
                    userRecord = adminUser;
                    userRole = 'Admin';
                    storedPassword = adminUser.password;
                    actualUserId = adminUser.id;
                }
            }
        }

        // Check if user exists
        if (!userRecord) {
            console.log("User not found:", id);
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, storedPassword);

        if (!isMatch) {
            console.log("Invalid credentials for:", id);
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // --- Generate JWT ---
        const payload = {
            id: actualUserId, // Use the correct ID field
            role: userRole
        };
        console.log("haaha"+payload.id);

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        console.log(`Login successful for ${userRole}: ${id}`);
        // --- Return token and role ---
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: token, // Send the token to the client
            role: userRole, // Still useful for immediate redirect
            userId: payload.id // Send userId back too
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};