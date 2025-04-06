import { DataTypes } from "sequelize";
import sequelize from "../Config/dbConnect.js";

const Admin = sequelize.define(
    "Admin",
    {
        id : {
            type : DataTypes.STRING,
            primaryKey : true , 
        },
        name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false
        }
    },
    {
        timestamps : true
    }
)
const syncAdminTable = async() =>{
    try {
        await Admin.sync();
        console.log('Admin Table created successfully');

    } catch (error) {
        console.log('Error in creating Admin table');
    }
}
syncAdminTable();

export default Admin;