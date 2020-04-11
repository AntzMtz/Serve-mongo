const mongoDb = require('mongoose');
const { Schema } = mongoDb;

var AlumSchema = new Schema({
    idAlumno: { type: String, required: true },
    idEscuela: { type: String, required: true },
    codQr: { type: String, required: true },
    grado: { type: String, required:false },
    grupo: { type: String, required:false },
    correoTutor:{type:String, required:true},
    nombreTutor:{type:String,required:true},
    nombre:{type:String,required:true},
    aPaterno:{type:String,required:true},
    aMaterno:{type:String,required:true},
    direccion:{type:String,required:true},
    delegacion:{type:String,required:true},
    estado:{type:String,required:true},
    materias:{type:Array,required:true}
});

module.exports = mongoDb.model('alumnos01', AlumSchema);