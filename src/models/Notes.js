const mongoDb = require('mongoose');
const { Schema } = mongoDb;

var NoteSchema = new Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    dia: { type: Date, required: true },
    user: { type: String, required: true },
    grado: { type: Array, required: true },
    centro:{type:String, required:true},
    grupo:{type:String, required:true}

});

module.exports = mongoDb.model('notas', NoteSchema);