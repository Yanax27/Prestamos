const express = require("express");
const router = express();

const { postCreateUser } = require("../controllers/usuarioController");
const { catchedAsync } = require("../utils");

// router.get("/", catchedAsync(userController));
router.post("/", catchedAsync(postCreateUser));

module.exports = router;
