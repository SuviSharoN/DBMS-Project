import express from "express";
import 'dotenv/config';

import mysql from "mysql2";
import { Sequelize } from "sequelize"; // Corrected typo
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const sequelize = new Sequelize(
  "student_administration", "root", "SharoN079", {
  host: "localhost",
  dialect: "mysql",}
);

// Test database connection
sequelize.authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Error connecting to database:", err));


export default sequelize