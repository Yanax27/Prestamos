const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Prestamo", {
    id_prestamo: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    fechaInicial:{
        type: DataTypes.DATE,
        allowNull:true
    },
    monto:{
        type:DataTypes.BOOLEAN,
        allowNull:true
    },
    interes:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    numeroCuota:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    valorCuota:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    tipoCuota:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    verificarPago:{
        type:DataTypes.ARRAY(DataTypes.TEXT),
        allowNull:true
    },
    fechas:{
        type:DataTypes.ARRAY(DataTypes.DATE),
        allowNull:true
    },
    deudaActual:{
        type:DataTypes.DOUBLE,
        allowNull:true
    }
  });
};
