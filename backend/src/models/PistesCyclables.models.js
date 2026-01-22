import { DataTypes } from "sequelize";

const PistesCyclables = async (sequelize)=>{
    sequelize.define('Piste_cyclable',{
        commune:{
            type:DataTypes.STRING,
            allowNull:false
        },
        codePostal:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        nombre:{
            type:DataTypes.FLOAT,
            allowNull:false
        }
    },{
        timestamps:false,
        tableName:'piste_cyclable'
    })
}

export default PistesCyclables;