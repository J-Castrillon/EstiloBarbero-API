const { Router } = require("express");
const multer = require("multer");

// Controlador de articulos;
const {
  prueba,
  save,
  allArticles,
  findOne,
  removeArticle,
  update,
  sendImage,
  image,
  search
} = require("../Controllers/article");

// Enrutador;
const router = Router();

// Rutas de prueba;
router.get("/ruta-de-prueba", prueba);

// Almancenar articulos;
router.post("/save", save);

// Obtener todos los documentos almacenados;
// router.get('/allArticles', allArticles);
router.get("/allArticles/:count?", allArticles); // Paso de params, con el ? quiere decir que no va a ser obligatorio;

// Obtener un solo elemento;
router.get("/article/:idArticle", findOne);

// Borrar un articulo;
router.delete("/article/:idArticle", removeArticle);

// Actualizar un articulo;
router.put("/article/:idArticle", update);

// Subir imagenes;
// Luego de importar multer:
// Debemos crear la ruta de almacenamiento teniendo en cuenta el archivo que se va a almacenar;
const storageImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/articles"); // Ruta de almacenamiento;
  },
  filename: function (req, file, cb) {
    cb(null, `article${Date.now()}${file.originalname}`); // Nombre personalizado para el file;
  },
});

// Middleware;
const subida = multer({ storage: storageImage });

router.post("/send-image/:id?", subida.single("file0"), sendImage); // En el middleware estamos diciendo que va a ser solo uno con single;

// Ver imagenes;
router.get("/show-image/:fichero?", image);

// Busqueda de articulos; 
router.get("/search/:busqueda", search); 

module.exports = router;
