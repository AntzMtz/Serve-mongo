const mongoDb = require('mongoose');
const { Schema } = mongoDb;

var TareaSchema = new Schema({
    idAlumnos: { type: String, required: true },
    idEscuela: { type: String, required: true },
    idTareas: { type: Array, required: true }
});

module.exports = mongoDb.model('tareas', TareaSchema);