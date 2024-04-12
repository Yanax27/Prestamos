const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Prestario", {
    id_prestario: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false,
    },
    nombre:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    apellido:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    ci:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    direccion:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    telefono:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    negocio:{
        type:DataTypes.TEXT,
        allowNull:true
    },
    estado:{
        type:DataTypes.TEXT,
        allowNull:true
    }
  });
};
