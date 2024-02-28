const validator = require("validator");

// Validaciones;
const validateArticle = (parameters) => {
    // Validacion de los datos;
    let validateTitle = !validator.isEmpty(parameters.title); // Comprobamos que no este vacio
    // Tambien podemos hacer varias validaciones para un mismo tipo de dato;
    let validateContent =
      !validator.isEmpty(parameters.content) &&
      validator.isLength(parameters.content, { min: 5 });
  
    if (!validateTitle || !validateContent) {
      throw new Error("Faltan datos");
    }
  };

module.exports = {validateArticle}