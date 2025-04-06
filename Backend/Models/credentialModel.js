import { DataTypes } from "sequelize";
import { sequelize } from "../Config/dbConnect.js";
import Student from "./studentModel.js";

const Credential = sequelize.define(
    "Credential" , 
    {
        id : {
            type : DataTypes.INTEGER , 
            primaryKey : true , 
            autoIncrement : true
        },
        student_id : {
            type : DataTypes.INTEGER , 
            allowNull : false ,
            references : {
                model : Student , 
                key : 'id'
            }
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false
        }
    }
);

Student.hasOne(Credential , {foreignKey : 'student_id'});
Credential.belongsTo(Student , {foreignKey : 'student_id'});

const syncCredentialTable = async ()=>{
    try {
        await Credential.sync();
        console.log('Credential table created successfully');
    } catch (error) {
        console.log('Error in creating credential table');
    }
}
syncCredentialTable();

export default Credential;