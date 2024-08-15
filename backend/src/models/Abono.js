const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Abono", {
    id_abono: {
      type: DataTypes.UUID, 
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    monto: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha:{
        type: DataTypes.DATE,
        allowNull: true,
    }
  });
};
