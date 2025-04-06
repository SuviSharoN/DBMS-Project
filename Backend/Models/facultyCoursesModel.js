import { DataTypes } from "sequelize";
import  sequelize  from "../Config/dbConnect.js";
import Faculty from "./facultyModel.js";
import Course from "./courseModel.js";

const facultyCourse = sequelize.define(
    "facultyCourse",
    {
        id : {
            type : DataTypes.INTEGER , 
            autoIncrement : true,
            primaryKey : true
            
        },
        faculty_id : {
            type : DataTypes.STRING,
            allowNull : false ,
            references : {
                model  : Faculty,
                key : 'id'
            }
        },
        course_id : {
            type : DataTypes.STRING,
            allowNull : false , 
            references : {
                model : Course,
                key : 'id'
            }
        },
        available_seats : {
            type : DataTypes.INTEGER , 
            defaultValue : 60
        }
    },
    {
        timestamps : true,
        indexes : [
            {
                unique : true ,
                fields : ['faculty_id' , 'course_id']
            }
        ]
    }
);

const syncFacultyCourseTable = async ()=>{
    try {
        await facultyCourse.sync({alter : true});
        console.log('Faculty Course table is created successfully');    
    } catch (error) {
        console.log('Error in creating Faculty Course table ' , error);    
    }
}
syncFacultyCourseTable();
export default facultyCourse;