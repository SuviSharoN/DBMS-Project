import { DataTypes } from "sequelize";
import  sequelize  from "../Config/dbConnect.js";
import Student from "./studentModel.js";

const Contact = sequelize.define(
    "Contact",{
        id: {
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
        phone : {
            type : DataTypes.STRING,
            allowNull : false
        },
        address : {
            type : DataTypes.STRING,
            allowNull : false
        },
        guardian_name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        guardian_phone: {
            type : DataTypes.STRING,
            allowNull : false
        }
    },
    {
        timestamps : true
    }
);

Student.hasOne(Contact , {foreignKey : 'student_id'});
Contact.belongsTo(Student , {foreignKey : 'student_id'});

const syncContactTable = async ()=>{
    try {
        await Contact.sync();
        console.log("Contact table created successfully");
    } catch (error) {
        console.log('Error in creating Contact table ' , error)
    }
}

syncContactTable();

export default Contact;