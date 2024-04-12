const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Egreso", {
    id_egreso: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    monto: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    fecha:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    concepto:{
        type: DataTypes.TEXT,
        allowNull: true,
    }
  });
};
