const mongoDb = require('mongoose');
const { Schema } = mongoDb;


var MateriaSh = new Schema({
    Nombre: { type: String, required: true },
    Grado: { type: String, required: true },
    ClaveCentro: { type: String, required:true }
});

module.exports = mongoDb.model('clase01', MateriaSh);