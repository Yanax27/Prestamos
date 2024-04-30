require("dotenv").config();
const jwt = require("jsonwebtoken");
const { response } = require("../utils");
const { ClientError } = require("../utils/errors");
const { Usuario, Roles } = require("../db");
const { PRIVATE_KEY } = process.env;

module.exports = {
  createToken: async (payload) => {
    return await jwt.sign(payload, PRIVATE_KEY, { expiresIn: "1h" });
  },
  verifyToken: async (req, res) => {
    const token = req.cookies.token;
    if(!token){
        response(res, 200, { MessageChannel: "Token is null"});
    }
    const result = await jwt.verify(token, PRIVATE_KEY);
    const user = await Usuario.findOne({
      where: { correo: result.correo },
      include: Roles,
    });
    console.log(user);
    if (!result) {
      throw new ClientError("Token is invalid", 401);
    }

    if (!user) {
      throw new ClientError("Token is invalid", 401);
    }
    const obj = {
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      rol: user.Role.tipo,
    };
    response(res, 200, { userData: obj, MessageChannel: "Token is valid" });
  },
  logoutSession: async (req, res) => {
    res.clearCookie("token");
    response(res, 200, { MessageChannel: "Logout Successfully" });
  },
};
