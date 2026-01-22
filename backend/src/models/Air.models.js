import { DataTypes } from "sequelize";

const Air = async (sequelize)=>{
    sequelize.define('Air',{
        qualite:{
            type:DataTypes.STRING,
            allowNull:true
        },
        couleur:{
            type:DataTypes.STRING,
            allowNull:true
        },
        commune:{
            type:DataTypes.STRING,
            allowNull:false
        },
        valeur:{
            type:DataTypes.FLOAT,
            allowNull:true
        }
    },{
        tableName:"air",
        timestamps: false
    })
}

export default Air;