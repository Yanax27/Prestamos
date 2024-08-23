const { Op } = require("sequelize");

class PrestamoDao{
    //obtener todos los Prestamos
    async getAllPrestamos(PrestamoModel, filter){
        console.log(filter)
        const queryfilterUsuario= {
            association: 'Usuario',   
            attributes: ['nombre', 'email']  
        }
        if (filter.nombre ){
            queryfilterUsuario.where ={nombre: filter.nombre };
        }
        console.log(queryfilterUsuario)
      // Si hay un filtro para 'email'
      if (filter.email) {
        console.log(queryfilterUsuario)
        if (filter.nombre) {
            console.log(queryfilterUsuario)
            // Si ya existe un filtro para 'nombre', combinarlo con 'email' usando Op.and
            queryfilterUsuario.where = {
                [filter.operador=='or'?Op.or:Op.and]: [
                    { nombre: filter.nombre },
                    { email: filter.email }
                ]
            };
        } else {
            // Si solo hay un filtro para 'email'
            queryfilterUsuario.where = {email:filter.email};
            console.log(queryfilterUsuario)
        }
    }
    console.log(queryfilterUsuario)
        return await PrestamoModel.findAll(
            {
                include: [
                    {
                        association: 'Prestario',
                        attributes: ['nombre', 'negocio', 'telefono'],
                    },
                        queryfilterUsuario     
                ]
        }
        )
    }

}
module.exports = new PrestamoDao();