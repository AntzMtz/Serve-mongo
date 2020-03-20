const mongoDb = require('mongoose');
const { Schema } = mongoDb;

var NoteSchema = new Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    dia: { type: Date, required:false },
    user: { type: String, required:false }

});

module.exports = mongoDb.model('notas', NoteSchema);