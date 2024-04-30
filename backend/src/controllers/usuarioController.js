const { Usuario, Roles } = require("../db");
const { createToken } = require("../services/jwtService");
const { response } = require("../utils");
const { ClientError } = require("../utils/errors");

module.exports = {
  userController: async (req, res) => {
    res.status(200).send("<h1>Welcolme Prestamos App!</h1>");
  },
  loginUser: async (req, res) => { 
    const { correo, contraseña } = req.body;
    const user = await Usuario.findOne({ where: { correo }, include: Roles });
    if (!user) { 
      throw new ClientError("Correo inválido", 404);
    }
    if (user.contraseña !== contraseña) { 
      throw new ClientError("Contraseña inválida", 404);
    }
    console.log(user);
    const obj = {
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      rol: user.Role.tipo,
    };
    const token = await createToken(obj);
    res.cookie("token", token, {
      httpOnly: true,
    });
    response(res, 200, {
      token: token,
      userData: obj,
      MessageChannel: "Login Successfully",
    });
  },
  postCreateUser: async (req, res) => {
    const { nombre, apellido, correo, contraseña, rol } = req.body;
    const selectedRol = await Roles.findOne({ where: { tipo: rol } });
    console.log(selectedRol);
    const newUser = await Usuario.create({
      nombre,
      apellido,
      correo,
      contraseña,
      RoleIdRol:selectedRol.id_rol
    });
    response(res, 200, { MessageChannel: "User create Successfully" });
  },
};
