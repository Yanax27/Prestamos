const { Op } = require('sequelize');

class PrestamoDao {
  //obtener todos los Prestamos
  async getAllPrestamos(PrestamoModel, filter) {
    // Configuración para el filtro del usuario
    const queryfilterUsuario = {
      association: 'Usuario',
      attributes: ['nombre', 'email'],
    };

    // Aplicar filtro por nombre
    if (filter.nombre) {
      queryfilterUsuario.where = { nombre: filter.nombre };
    }

    // Si hay un filtro para 'email'
    if (filter.email) {
      if (filter.nombre) {
        // Si existe un filtro para 'nombre', combinarlo con 'email' usando Op.and o Op.or
        queryfilterUsuario.where = {
          [filter.operador === 'or' ? Op.or : Op.and]: [
            { nombre: filter.nombre },
            { email: filter.email },
          ],
        };
      } else {
        // Si solo hay un filtro para 'email'
        queryfilterUsuario.where = { email: filter.email };
      }
    }

    // Configuración para el filtro del prestario
    const queryfilterPrestario = {
      association: 'Prestario',
      attributes: ['nombre', 'negocio', 'telefono'],
    };

    // Si hay un filtro para 'idPrestario'
    console.log("filtro prestario", filter.idPrestario)
    if (filter.idPrestario) {
      queryfilterPrestario.where = { id_prestario: filter.idPrestario };
    }

    // Consulta para obtener todos los préstamos con los filtros
    return await PrestamoModel.findAll({
      include: [
        queryfilterPrestario,
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
