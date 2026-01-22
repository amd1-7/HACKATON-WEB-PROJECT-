import { DataTypes } from "sequelize";

const EnergieLogement = async (sequelize) => {
    sequelize.define('EnergieLogement', {
        commune: {
            type: DataTypes.STRING,
            allowNull: false
        },
        passoires_thermiques: { 
            type: DataTypes.FLOAT, 
            allowNull: true
        },
        total_analyse: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: "energie_logement",
        timestamps: false
    });
}

export default EnergieLogement;