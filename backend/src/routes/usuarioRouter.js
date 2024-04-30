const express = require("express");
const router = express();

const { postCreateUser, loginUser } = require("../controllers/usuarioController");
const { catchedAsync } = require("../utils");
const { verifyToken, logoutSession } = require("../services/jwtService");

// router.get("/", catchedAsync(userController));
router.post("/", catchedAsync(postCreateUser));
router.post("/login", catchedAsync(loginUser));
router.get("/validToken", catchedAsync(verifyToken));
router.get("/logout", catchedAsync(logoutSession));


module.exports = router;
