import Faculty from "./facultyModel.js";
import Course from "./courseModel.js";
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
}

export default associateModels;