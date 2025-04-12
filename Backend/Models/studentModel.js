import { DataTypes } from "sequelize";
import sequelize  from '../Configuration/dbConnect.js';
const Student = sequelize.define(
    "Student",
    {
        id :{
            type : DataTypes.INTEGER,
            primaryKey : true,
            
        },
        name:{
            type: DataTypes.STRING,
            allowNull : false,
            set(value) {
                this.setDataValue('name', value.trim());
              }
        },
        email : {
            type: DataTypes.STRING,
            unique : true,
            allowNull : false ,
            validate : {
                isEmail : true
            }
        },
        dob : {
            type: DataTypes.DATEONLY,
            allowNull : false
        },
        gender: {
            type: DataTypes.ENUM("Male", "Female", "Other"),
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM("BC", "MBC", "SC", "ST" , "OC"),
            allowNull: false,
        },
        reservation: {
            type: DataTypes.BOOLEAN,
            defaultValue: false, 
        },
    },
    {
        timestamps : true
    }
)

const syncStudentTable = async ()=>{
     try {
        await Student.sync();
        console.log("Student table created successfully");
     } catch (error) {
        console.log("Error in creating student table " , error );
     }
}

syncStudentTable();

export default Student;