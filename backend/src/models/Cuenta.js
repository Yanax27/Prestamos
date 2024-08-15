const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Cuenta", {
    id_cuenta: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    cajaActual:{
        type: DataTypes.DOUBLE,
        allowNull:true,
    },
    capital:{
        type:DataTypes.DOUBLE,
        allowNull:true,
    },
    cajaUltimaLiquidacion:{
        type:DataTypes.DOUBLE,
        allowNull:true
    },
    ventas:{
        type:DataTypes.DOUBLE,
        allowNull:true
    },
    fechaUltimaLiquidacion:{
        type:DataTypes.DATE,
        allowNull:true
    }
  });
};
