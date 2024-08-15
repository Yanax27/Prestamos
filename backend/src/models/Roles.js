const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Roles", {
    id_rol: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  });
};
