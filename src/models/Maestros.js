const mongoDb = require('mongoose');
const { Schema } = mongoDb;
// console.log("esquema");

// console.log(Schema);


var MaesSchema = new Schema({
    Nombre: { type: String, required: true },
    Materia: { type: Array, required: true },
    Centro: { type: String, required: true },
    ClaveCentro: { type: String, required:false },
    PassMaes:{type:String, required:true},
    Estatus:{type:Boolean,required:true},
    IDMaestro:{type:String,required:true},
    Puesto:{type:Array,required:true}
    
});

module.exports = mongoDb.model('Maestros', MaesSchema);