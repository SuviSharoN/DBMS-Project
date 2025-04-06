import { DataTypes } from "sequelize";
import  sequelize  from "../Config/dbConnect.js";
import Student from "./studentModel.js";

const Academics = sequelize.define(
   "Academics",
   {
     id : {
        type : DataTypes.INTEGER,
        primaryKey : true , 
        autoIncrement : true
     },
     student_id : {
        type : DataTypes.INTEGER,
        allowNull : false ,
        references : {
            model : Student,
            key : 'id'
        }
     },
     department : {
        type : DataTypes.STRING,
        allowNull : false ,
        set(value) {
            this.setDataValue('department', value.trim());
        }
     },
     year_of_study : {
        type : DataTypes.ENUM('1','2','3','4'),
        allowNull : false
     },
     admission_year : {
        type : DataTypes.INTEGER,
        allowNull : false
     }
   },
   {
    timestamps : true
   }

);

Student.hasOne(Academics , {foreignKey : 'student_id'});
Academics.belongsTo(Student , {foreignKey : 'student_id'});

const syncAcademicsTable = async ()=>{
    try {
        await Academics.sync();
        console.log('Academics Table connected successfully');
    } catch (error) {
        console.log('Error in connecting Academics table ' , error);
    }
}

syncAcademicsTable();

export default Academics;