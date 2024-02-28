const Article = require("../Models/Article");
const { validateArticle } = require("../helpers/validate");
const fs = require("fs"); // Permite borrar archivos;
const path = require("path"); // Devolver archivos;

const prueba = (req, res) => {
  return res.status(200).json({
    message: "Controlador de prueba para articulos",
  });
};

const save = async (req, res) => {
  // Recoger los parametros para almacenar;
  const parameters = req.body; // Lo que enviamos por el request;

  // Validacion del formulario;
  try {
    validateArticle(parameters);
  } catch (error) {
    return res.status(400).json({
      message: "Error, faltan datos",
    });
  }

  // Crear un objeto como el modelo especifico (esquema);
  const article = new Article(parameters); // la manera de hacerlo automatico es pasarle como parametro, el cuerpo de mi request;

  // Almacenar el articulo en la base de datos;
  // Tener cuidado la asincronia, que tambien es necesaria con las bases de datos no sql;
  const send = await article.save(); // Ya no acepta parametros;

  if (send) {
    // Devolver el resultado;
    return res.status(200).json({
      message: "Accion de almacenar articulos",
      parameters,
      article
      
    });
  } else {
    return res.status(400).json({
      title: "No fue posible almacenar la informacion",
      content: error,
    });
  }
};

// Devolver todos los documentos de la coleccion;
const allArticles = async (req, res) => {
  // const query = await Article.find({}).exec();

  const limit = req.params.count;

  // Si quiero tambien ponerle un orden;
  const query = await Article.find({})
    .sort({ dates: -1 }) // Ordenar desde el mas nuevo al mas viejo;
    .limit(limit && limit) // En caso de querer limitar;
    .exec();

  if (!query) {
    return res.status(400).send("No se encontraron datos");
  }

  return res.status(200).json({
    message: "Sucessfull",
    params: req.params.count, // Esta es la forma en que se reciben los datos pasados por parametros de url;
    count: query.length,
    query,
  });
};

// Encontrar uno por id pasada por params;
const findOne = async (req, res) => {
  // Recoger el di por la url;
  const id = req.params.idArticle;

  // Buscar el article;
  const oneArticle = await Article.findById(id).exec();

  // Si no existe devolver un error;
  if (!oneArticle) {
    return res.status(400).send("No se encontraron datos");
  }

  // Si existe devolver el resultado;
  return res.status(200).json({
    message: "Sucessfull",
    oneArticle,
  });
};

// Borrar un documento;
const removeArticle = async (req, res) => {
  // Almacenar el dato por param;
  const id = req.params.idArticle;

  // Borrar;
  const deleted = await Article.findOneAndDelete(id);

  // Si no se pudo borrar, retornar un error;
  if (!deleted) {
    return res.status(400).send("No se pudieron eliminar los datos");
  }

  // Si existe, retonamos que ya se elimino y la info del documento eliminado;
  return res.status(200).json({
    message: "Deleted",
    deleted,
  });
};

// Actualizar articulo
const update = async (req, res) => {
  // Obtener el id del articulo;
  const id = req.params.idArticle;

  // Recoger los nuevos datos que queremos guardar;
  const parameters = req.body;

  // Validacion de los datos;
  try {
    validateArticle(parameters);
  } catch (error) {
    return res.status(400).json({
      message: "Error, faltan datos",
    });
  }

  // Actualizar;
  const send = await Article.findOneAndUpdate({ _id: id }, parameters, {
    new: true,
  }); // La propiedad del objeto {new: true} quiere decir que nos va a devolver el articulo actualizado;

  // Devolver una respuesta;
  if (!send) {
    return res.status(400).send("No se pudieron actualizar los datos");
  }

  return res.status(200).json({
    message: "Updated",
    parameters,
    send
  });
};

// Subir imagenes;
const sendImage = async (req, res) => {
  // Configuracion de Multer. Recordar que es una dependencia instalada previamente;
  const id = req.params.id;

  if (!req.file) {
    return res.status(400).json({
      status: "Error",
      message: "Peticion invalida",
    });
  }

  // Recoger el fichero de imagen;
  console.log(req.file);

  // Nombre del archivo;
  const file = req.file.originalname; // *Importante;

  // Extension del archivo;
  const splits = file.split(".");
  const exten = splits[1];

  // Comprobar la extension correcta;
  if (
    exten !== "png" &&
    exten !== "jpg" &&
    exten !== "jpeg" &&
    exten !== "gif"
  ) {
    // Borrar archivo;
    fs.unlink(req.file.path, () => {
      return res.status(400).json({
        status: "Error",
        message: "Imagen invalida",
      });
    });
  } else {
    // Actualizar el articulo al que se le va a adjuntar la imagen;
    const send = await Article.findOneAndUpdate(
      { _id: id },
      { image: req.file.filename },
      {
        new: true,
      }
    ); // La propiedad del objeto {new: true} quiere decir que nos va a devolver el articulo actualizado;

    if (!send) {
      throw new Error("Error en la actualizacion del articulo");
    }

    // Devolver una respuesta;
    return res.status(200).json({
      message: "Sucess",
      article: send,
      files: req.file,
    });
  }
};

// Ruta para ver las imagenes;
const image = async (req, res) => {
  const fichero = req.params.fichero;

  const rutaFisica = "./images/articles/" + fichero;

  fs.stat(rutaFisica, (error, exist) => {
    if (exist) {
      return res.sendFile(path.resolve(rutaFisica)); // Devolvemos el archivo;
    } else {
      return res.status(404).json({
        message: "No se pudo encontrar la imagen",
      });
    }
  });
};

// Buscar articulos en la base de datos;
const search = async (req, res) => {
  // Obtener la busqueda;
  const busqueda = req.params.busqueda;

  // Find con OR;
  const result = await Article.find({
    $or: [
      { "title": {"$regex": busqueda, "$options": "i" } }, // Estamos diciendo que el titulo incluya como expresion regular, la busqueda;
      { "content": { "$regex": busqueda, "$options": "i" } },
    ],
  })
    .sort({ dates: -1 }) // Ordenar el resultado;
    .exec(); // Ejecutar la consulta;

  // Devolver el resultado;
  if (!result) {
    return res.status(400).json({
      message: "No se encuentra ningun elemento",
    });
  } else {
    return res.status(200).json({
      status: "Sucess",
      result,
    });
  }
};

module.exports = {
  prueba,
  save,
  allArticles,
  findOne,
  removeArticle,
  update,
  sendImage,
  image,
  search,
};
