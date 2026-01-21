import { DataTypes } from "sequelize";

const Bus = async (sequelize)=>{
    sequelize.define('Bus',{
        nombre:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        commune:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        codePostal:{
            type:DataTypes.STRING,
            allowNull:true,
        }
    },{
        tableName:"bus",
        timestamps: false
    })
}

export default Bus;