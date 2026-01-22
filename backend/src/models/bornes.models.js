import { DataTypes } from "sequelize";

const Bornes = async (sequelize)=>{
    sequelize.define('Borne',{
        adresse:{
            type:DataTypes.STRING,
            allowNull:true
        },
        nom:{
            type:DataTypes.STRING,
            allowNull:true
        },
        commune:{
            type:DataTypes.STRING,
            allowNull:false
        },
        nombre:{
            type:DataTypes.FLOAT,
            allowNull:true
        }
    },{
        tableName:"borne",
        timestamps: false
    })
}

export default Bornes;