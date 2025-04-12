import { DataTypes } from "sequelize";
import  sequelize  from "../Configuration/dbConnect.js";
import Student from "./studentModel.js";
import Course from "./courseModel.js";
import Faculty from "./facultyModel.js";

const Enrollment = sequelize.define(
    "Enrollment" , 
    {
        id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        student_id : {
            type : DataTypes.INTEGER,
            allowNull : false ,
            references : {
                model : 'Students',
                key : 'id'
            },
            onDelete : "CASCADE",
            onUpdate : "CASCADE"
        },
        faculty_course_id: {
            type: DataTypes.INTEGER, // Match facultyCourse.id type
            allowNull: false,
            references: {
                model: 'facultyCourses', // The table name for facultyCourse
                key: 'id'
            }
        },
        enrollment_date :{
            type : DataTypes.DATE, 
            allowNull : false , 
            defaultValue : DataTypes.NOW
        }

    },{
        timestamps : true,
        indexes : [
           {
              unique : true , 
              fields : ['student_id' , 'faculty_course_id']
           }
        ]
    }
);
// Enrollment.associate = (models) => {
//     Enrollment.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
//     // An Enrollment belongs to one specific facultyCourse offering
//     Enrollment.belongsTo(models.facultyCourse, { foreignKey: 'faculty_course_id', as: 'offering' });
// };
// const syncEnrollmentTable = async ()=>{
//     try {
//         await Enrollment.sync();
//         console.log('Enrollment table is created successfully');
//     } catch (error) {
//         console.log('Error in creating Enrollment table ' , error);
//     }
// }
// syncEnrollmentTable();
export default Enrollment;