const { Usuario } = require("../db");
const { response } = require("../utils");

module.exports = {
  userController: async (req, res) => {
    res.status(200).send("<h1>Welcolme Prestamos App!</h1>");
  },
  postCreateUser: async (req, res) => {
    const usuario = req.body;
    const newUsuer = await Usuario.create(usuario);
    response(res, 200, {MessageChannel:"User create Successfully"});
  },
};
