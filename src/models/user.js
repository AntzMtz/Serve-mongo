const mongoDb = require('mongoose');
const { Schema } = mongoDb;
// console.log("esquema");
const bcrypt = require('bcryptjs');
var UserSchema = new Schema({
    idUser: { type: String, required: true },
    Password: { type: String, required: true },
    Nombre:{type:String, required:true},
    dia: { type: Date, default: Date.now },
    Tipo:{type:String,required:true}
});

UserSchema.methods.encrypPass= async (password)=>{
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password,salt);
    return hash;
};

// UserSchema.methods.desCript= async (password, savePassword) => {
//     console.log("pass    :" + password);
//     console.log("passSave:" + savePassword);
//     return await bcry.compare(password, savePassword);
// };

// UserSchema.methods.desCript= async function (password, savePassword){
//     console.log("pass    :" + password);
//     console.log("passSave:" + savePassword);
//     return await bcry.compare(password, savePassword);
//     // return await bcrypt.compare(password,this.Password)
// };



module.exports = mongoDb.model('usuarios01', UserSchema);