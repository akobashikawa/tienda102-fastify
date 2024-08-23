const { BeforeAll, AfterAll, Before, After, Given, When, Then } = require('@cucumber/cucumber');
const { assertThat, is, not, containsString, hasProperty } = require('hamjest');
// const sinon = require('sinon');
// const puppeteer = require('puppeteer');
// const { app } = require('../../server');
const app = require('../../app');

async function resetTableProductos() {
    await app.sequelize.query('DELETE FROM Productos');
    await app.sequelize.query('DELETE FROM sqlite_sequence WHERE name="Productos"');
    this.producto = await app.services.productosService.createItem({
        nombre: 'Producto Nuevo',
        costo: 10,
        precio: 15,
        cantidad: 10,
    });
}

async function resetTablePersonas() {
    await app.sequelize.query('DELETE FROM Personas');
    await app.sequelize.query('DELETE FROM sqlite_sequence WHERE name="Personas"');
    this.persona = await app.services.personasService.createItem({
        nombre: 'Ana',
    });
}

async function resetTableVentas() {
    await resetTableProductos();
    await resetTablePersonas();
    await app.sequelize.query('DELETE FROM Ventas');
    await app.sequelize.query('DELETE FROM sqlite_sequence WHERE name="Ventas"');
    this.venta = await app.services.ventasService.createItem({
        producto_id: this.producto.id,
        persona_id: this.persona.id,
        precio: 15,
        cantidad: 1,
    });
}

BeforeAll(async function () {
    // browser = await puppeteer.launch();
    // page = await browser.newPage();
});

AfterAll(async function () {
    // await browser.close();
    // await app.close();
});

Before(async function () {
    // await resetTable();
});

After(async function () {

});

Then('la respuesta debería contener una lista de ventas', async function () {
    // const body = await this.response.text();
    // assertThat(body, containsString('ventas'));
    assertThat(Array.isArray(this.responseBody), is(true));
});

Given('que existe una venta con id {int}', async function (id) {
    await resetTableVentas();
    let venta = await app.services.ventasService.getItemById(id);
    assertThat(venta.id, id);
});

Then('la respuesta debería contener una venta con el producto_id {int} y precio {float}', async function (producto_id, precio) {
    assertThat(this.responseBody, hasProperty('producto_id', producto_id));
    assertThat(this.responseBody, hasProperty('precio', precio));
});

Then('la respuesta debería contener una venta con el id {int}', async function (id) {
    assertThat(this.responseBody, hasProperty('id', id));
});

Given('que no existe una venta con id {int}', async function (id) {
    let venta = await app.services.ventasService.getItemById(id);
    assertThat(venta, null);
});

Then('la respuesta debería contener la venta con id {int} actualizada con cantidad {int}', async function (id, cantidad) {
    assertThat(this.responseBody, hasProperty('id', id));
    assertThat(this.responseBody, hasProperty('cantidad', cantidad));
});

Then('la venta con id {int} ya no debería existir en la base de datos', async function (id) {
    const venta = await app.services.ventasService.getItemById(id);;
    assertThat(venta, is(null));
});

Given('el producto con id {int} tiene una cantidad {int}', async function (id, cantidad) {
    await resetTableProductos();
    await app.services.productosService.updateItem(id, { cantidad });
});

Then('el producto con id {int} debería tener una cantidad {int}', async function (id, cantidad) {
    const producto = await app.services.productosService.getItemById(id);
    assertThat(producto.cantidad, cantidad);
});