const {format}= require('timeago.js');

const help={};
help.time=(dia)=>{
    return format(dia);
};

module.exports=help;