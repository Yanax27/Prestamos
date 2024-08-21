class PrestamoDao{
    //obtener todos los Prestamos
    async getAllPrestamos(PrestamoModel){
        return await PrestamoModel.findAll(
            {
                include:[
                {
                    association: 'Prestatario',
                    atributes: ['nombre', 'negocio','telefono']
                }
            ]
        }
        )
    }

}
module.exports = new PrestamoDao();