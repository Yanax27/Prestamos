const express = require("express");
const { getAllAbonos, createAbono } = require("../controllers/abonoController");
const router = express();

// http://localhost:3001/api/abono/getall
router.get("/getall",getAllAbonos);
router.post("/create",createAbono)
module.exports = router;
