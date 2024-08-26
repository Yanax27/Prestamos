const { Op } = require('sequelize');

class PrestamoDao {
  //obtener todos los Prestamos
  async getAllPrestamos(PrestamoModel, filter) {
    //console.log(filter)
    const queryfilterUsuario = {
      association: 'Usuario',
      attributes: ['nombre', 'email'],
    };
    if (filter.nombre) {
      queryfilterUsuario.where = { nombre: filter.nombre };
    }
    // console.log(queryfilterUsuario)
    // Si hay un filtro para 'email'
    if (filter.email) {
      console.log(queryfilterUsuario);
      if (filter.nombre) {
        console.log(queryfilterUsuario);
        // Si ya existe un filtro para 'nombre', combinarlo con 'email' usando Op.and
        queryfilterUsuario.where = {
          [filter.operador == 'or' ? Op.or : Op.and]: [
            { nombre: filter.nombre },
            { email: filter.email },
          ],
        };
      } else {
        // Si solo hay un filtro para 'email'
        queryfilterUsuario.where = { email: filter.email };
        // console.log(queryfilterUsuario)
      }
    }
    //console.log(queryfilterUsuario)
    return await PrestamoModel.findAll({
      include: [
        {
          association: 'Prestario',
          attributes: ['nombre', 'negocio', 'telefono'],
        },
        queryfilterUsuario,
      ],
    });
  }

  // Crear un nuevo prestamo
  async createPrestamo(prestamoData, PrestamoModel) {
    return await PrestamoModel.create(prestamoData);
  }
  // Obtener un prestamo por ID
  async getPrestamoById(id, PrestamoModel) {
    return await PrestamoModel.findByPk(id);
  }
  // Actualizar un prestario
  async updatePrestamo(id, prestamoData, PrestamoModel) {
    const prestamo = await PrestamoModel.findByPk(id);
    if (!prestamo) return null;
    await prestamo.update(prestamoData);
    return prestamo;
  }
  // Eliminar un prestamo
  async deletePrestamo(id, PrestamoModel) {
    const prestamo = await PrestamoModel.findByPk(id);
    if (!prestamo) return null;
    await prestamo.destroy();
    return prestamo;
  }
}
module.exports = new PrestamoDao();
