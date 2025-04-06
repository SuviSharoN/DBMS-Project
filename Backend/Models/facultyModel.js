import { DataTypes } from "sequelize";
import  sequelize  from "../Config/dbConnect.js";
const Faculty = sequelize.define(
    "Faculty",
    {
        id : {
            type : DataTypes.STRING,
            primaryKey : true
        },
        name : {
            type : DataTypes.STRING,
            allowNull : false,
            set(value) {
                this.setDataValue('name', value.trim());
              }
        },
        email : {
            type : DataTypes.STRING,
            allowNull : false ,
            unique : true , 
            validate : {
                isEmail : true
            }
        },
        department : {
            type : DataTypes.STRING,
            allowNull : false,
            set(value) {
                this.setDataValue('department', value.trim());
            }
        },
        password: 
        {
            type:DataTypes.STRING,
            allowNull : false
        }
    },
    {
        timestamps : true,
        
    }
);


const syncFacultyTable = async () =>{
  try {
    await Faculty.sync();
    console.log('Faculty table is connected successfully');
  } catch (error) {
    console.log('Error in creating Faculty table ', error);
  }
}

syncFacultyTable();
export default Faculty;