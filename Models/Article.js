// El modelo permite definirle el nombre al modelo;
const { Schema, model } = require("mongoose");

const articleSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  dates: {
    type: Date,
    default: Date.now(),
  },
  image: {
    type: String,
    default: "default.png",
  },
});

// Debemos decirle que va a ser el modelo del esquema article que va a ser plural al buscar en la db (articles) 
// Y se le pasa el esquema en cuestion;
// Esta seria como la representacion de la entidad en nestjs. 
module.exports = model("Article", articleSchema);
