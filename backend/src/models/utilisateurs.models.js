import { DataTypes } from "sequelize";

const Utilisateurs = async (sequelize)=>{
    sequelize.define('Utilisateur',{
        mail:{
            type:DataTypes.STRING,
            allowNull:false
        },
        password:{
            type:DataTypes.STRING,
            allowNull:null
        },
        id:{
            primaryKey:true,
            autoIncrement:true,
            type:DataTypes.INTEGER,
            allowNull:false
        }
    },{
        timestamps:false,
        tableName:'utilisateur'
    })
}

export default Utilisateurs;