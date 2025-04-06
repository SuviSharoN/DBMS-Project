import { DataTypes } from "sequelize";
import { sequelize } from "../Configuration/asd.js";
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
                model : Student,
                key : 'id'
            },
            onDelete : "CASCADE",
            onUpdate : "CASCADE"
        },
        course_id : {
            type : DataTypes.STRING , 
            allowNull : false,
            references : {
                model : Course ,
                key : 'id'
            },
            onDelete : "CASCADE",
            onUpdate : "CASCADE"
        },
        faculty_id : {
            type : DataTypes.STRING , 
            allowNull : false,
            references : {
                model : Faculty , 
                key : 'id'
            },
            onDelete : "CASCADE",
            onUpdate : "CASCADE"
        },
        enrollment_date :{
            type : DataTypes.DATE, 
            allowNull : false , 
            defaultValue : DataTypes.NOW
        },
        status : {
            type : DataTypes.ENUM('Active' , 'Dropped' , 'Completed') ,
            allowNull : false
        },
        additional_data : {
            type : DataTypes.JSON,
            allowNull : true
        }

    },{
        timestamps : true,
        indexes : [
           {
              unique : true , 
              fields : ['student_id' , 'course_id']
           }
        ]
    }
);

const syncEnrollmentTable = async ()=>{
    try {
        await Enrollment.sync();
        console.log('Enrollment table is created successfully');
    } catch (error) {
        console.log('Error in creating Enrollment table ' , error);
    }
}
syncEnrollmentTable();
export default Enrollment;