const { Router } = require("express");
const abonoRouter = require("./abonoRouter");
const cuentaRouter = require("./cuentaRouter");
const egresoRouter = require("./egresoRouter");
const ingresoRouter = require("./ingresoRouter");
const prestamoRouter = require("./prestamoRouter");
const prestarioRouter = require("./prestarioRouter");
const rolesRouter = require("./rolesRouter");
const usuarioRouter = require("./usuarioRouter");

const router = Router();

router.use("/abono", abonoRouter); //"http://localhost:3001/api/abono"
router.use("/cuenta", cuentaRouter); //"http://localhost:3001/api/cuenta"
router.use("/egreso", egresoRouter); //"http://localhost:3001/api/egreso"
router.use("/ingreso", ingresoRouter); //"http://localhost:3001/api/ingreso"
router.use("/prestamo", prestamoRouter); //"http://localhost:3001/api/prestamo"
router.use("/prestario", prestarioRouter); //"http://localhost:3001/api/prestario"
router.use("/roles", rolesRouter); //"http://localhost:3001/api/roles"
router.use("/usuario", usuarioRouter); //"http://localhost:3001/api/usuario"


module.exports = router;
