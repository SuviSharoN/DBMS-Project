import sequelize from "./config/database.js"; 
import Student from "./models/student.js"; 

sequelize.sync({ force: false }) // force: true will drop and recreate the table
  .then(async () => {
    console.log("Database synced!");

    // Insert a sample student
    const student = await Student.create({
      name: "John Doe",
      email: "john.doe@example.com",
      age: 22,
    });

    console.log("Student inserted:", student.toJSON());
  })
  .catch((err) => console.error("Error syncing database:", err));
