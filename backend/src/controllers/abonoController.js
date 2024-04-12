const { response } = require("../utils");
const { Abono } = require("../db.js");

module.exports={
    getAllAbonos: async (req,res) => {
        const abonos = await Abono.findAll();
        response(res,200,abonos)
    },
    createAbono: async (req,res) => {
        const value = req.body;
        const newAbono = await Abono.create(value);
        response(res,200,newAbono)
    }
}