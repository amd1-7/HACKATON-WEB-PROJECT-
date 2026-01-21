import { DataTypes } from "sequelize";

const Communes = async (sequelize)=>{
    sequelize.define('Commune',{
        codeInsee:{
            type:DataTypes.STRING,
            allowNull:false,
            primaryKey:true
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
        tableName:"commune",
        timestamps: false
    })
}

export default Communes