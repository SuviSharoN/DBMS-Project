import { DataTypes } from "sequelize";
import { sequelize } from "../Config/dbConnect.js";

const Course = sequelize.define(
    "Courses" , {
        id : {
            type : DataTypes.STRING,
            primaryKey : true
        },
        course_name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        credits : {
            type : DataTypes.ENUM('1','2','3','4','5') ,
            allowNull : false
        }
    },
    {
        timestamps : false
    }

);



const syncCourseTable = async ()=>{
    try {
        await Course.sync();
        console.log('Course table is created successfully');
    } catch (error) {
        console.log('Error in creating course table' , error);
    }
}
syncCourseTable();
export default Course;