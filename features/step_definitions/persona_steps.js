const { BeforeAll, AfterAll, Before, After, Given, When, Then } = require('@cucumber/cucumber');
const { assertThat, is, not, containsString, hasProperty } = require('hamjest');
// const sinon = require('sinon');
// const puppeteer = require('puppeteer');
// const { app } = require('../../server');
const app = require('../../app');

let persona;

async function resetTablePersonas() {
    await app.sequelize.query('DELETE FROM Personas');
    await app.sequelize.query('DELETE FROM sqlite_sequence WHERE name="Personas"');
    this.persona = await app.services.personasService.createItem({
        nombre: 'Ana',
    });
}

BeforeAll(async function () {
    // browser = await puppeteer.launch();
    // page = await browser.newPage();
    // await resetTablePersonas();
});

AfterAll(async function () {
    // await browser.close();
    await app.close();
});

Before(async function () {

});

After(async function() {
    
});

Then('la respuesta debería contener una lista de personas', async function () {
    // const body = await this.response.text();
    // assertThat(body, containsString('personas'));
    assertThat(Array.isArray(this.responseBody), is(true));
});


Given('que existe una persona con id {int}', async function (id) {
    await resetTablePersonas();
    const persona = await app.services.personasService.getItemById(id);
    assertThat(persona.id, id);
});

Then('la respuesta debería contener una persona con el nombre {string}', async function (nombre) {
    assertThat(this.responseBody, hasProperty('nombre', nombre));
});


Then('la respuesta debería contener una persona con el id {int}', async function (id) {
    assertThat(this.responseBody, hasProperty('id', id));
});

Given('que no existe una persona con id {int}', async function (id) {
    try {
        await app.services.personasService.deleteItem(id);
    } catch(error) {}
    let persona = await app.services.personasService.getItemById(id);
    assertThat(persona, null);
});

Then('la respuesta debería contener la persona con id {int} actualizado con nombre {string}', async function (id, nombre) {
    assertThat(this.responseBody, hasProperty('id', id));
    assertThat(this.responseBody, hasProperty('nombre', nombre));
});

Then('la persona con id {int} ya no debería existir en la base de datos', async function (id) {
    const persona = await app.services.personasService.getItemById(id);;
    assertThat(persona, is(null));
});
