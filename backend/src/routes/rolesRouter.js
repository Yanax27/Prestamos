const express = require("express");
const { catchedAsync } = require("../utils");
const { createRol } = require("../controllers/rolesController");
const router = express();

router.post("/", catchedAsync(createRol) );

module.exports = router;
