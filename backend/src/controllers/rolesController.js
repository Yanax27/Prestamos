const { Roles } = require("../db");
const { response } = require("../utils");
module.exports = {
  createRol: async (req, res) => {
    const rol = req.body;
    const newRol = await Roles.create(rol);
    response(res,200,{MessageChannel:"Rol created successfully",newRol});
  },
};
