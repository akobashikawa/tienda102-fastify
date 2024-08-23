const { throws } = require("hamjest");

class VentasService {

    constructor({ ventasRepository, productosService, personasService }) {
        this.ventasRepository = ventasRepository;
        this.productosService = productosService;
        this.personasService = personasService;
    }

    ping() {
        return 'pong';
    }

    async getItems() {
        return this.ventasRepository.getItems();
    }

    async getItemById(id) {
        return this.ventasRepository.getItemById(id);
    }

    calcGanancia({costo, precio, cantidad}) {
        return cantidad * (precio - costo);
    }

    async createItem(data) {
        const persona = await this.personasService.getItemById(data.persona_id);

        if (!persona) {
            throw new Error('La persona no existe: ' + data.persona_id);
        }

        const producto = await this.productosService.getItemById(data.producto_id);

        if (!producto) {
            throw new Error('El producto no existe: ' + data.producto_id);
        }

        const productoData = producto.dataValues;
        if (productoData.cantidad < 0) {
            throw new Error('No hay suficientes existencias');
        }
        if (productoData.cantidad - data.cantidad < 0) {
            throw new Error('No hay suficientes existencias');
        }

        data.ganancia = this.calcGanancia({costo: producto.costo, precio: data.precio, cantidad: data.cantidad});

        const nuevaCantidad = productoData.cantidad - data.cantidad;
        await this.productosService.updateItem(productoData.id, {cantidad: nuevaCantidad});

        return this.ventasRepository.createItem(data);
    }

    async updateItem(id, data) {
        const persona = await this.personasService.getItemById(data.persona_id);

        if (!persona) {
            throw new Error('Persona no encontrada');
        }

        const producto = await this.productosService.getItemById(data.producto_id);

        if (!producto) {
            throw new Error('Producto no encontrado');
        }

        const productoData = producto.dataValues;
        if (productoData.cantidad < 0) {
            throw new Error('No hay suficientes existencias');
        }
        if (productoData.cantidad - data.cantidad < 0) {
            throw new Error('No hay suficientes existencias');
        }

        data.ganancia = this.calcGanancia({costo: producto.costo, precio: data.precio, cantidad: data.cantidad});

        const diferencia = data.cantidad - venta.cantidad;
        const nuevaCantidad = productoData.cantidad - diferencia;
        await this.productosService.updateItem(productoData.id, {cantidad: nuevaCantidad});

        return this.ventasRepository.updateItem(id, data);
    }

    async deleteItem(id) {
        return this.ventasRepository.deleteItem(id);
    }

}

module.exports = VentasService;