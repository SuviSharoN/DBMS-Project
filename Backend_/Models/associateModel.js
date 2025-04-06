import Faculty from "./facultyModel.js";
import Course from "./courseModel.js";
import Student from "./studentModel.js";
import Enrollment from "./enrollmentModel.js";
import facultyCourse from "./facultyCoursesModel.js";
const associateModels = () =>{
    Faculty.belongsToMany(Course, {
        through: "facultyCourse",
        foreignKey: "faculty_id"
    });
    Course.belongsToMany(Faculty, {
        through: "facultyCourse",
        foreignKey: "course_id"
    });
    Enrollment.belongsTo(Student, { foreignKey: 'student_id' });
    Enrollment.belongsTo(Course, { foreignKey: 'course_id' });
    Enrollment.belongsTo(Faculty, { foreignKey: 'faculty_id' });

}

export default associateModels;