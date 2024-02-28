const {connect} = require("./Databases/connection");  
const express = require("express");
const cors = require("cors");


console.log('Estamos haciendo una ejecucion con nodejs');

// Conectar a la base de datos; 
connect();

// Crear el servidor con node; 
const app = express(); 

// Configuracion del cors; 
app.use(cors()); 

// Convertir el body de las respuestas a un objeto js; 
app.use(express.json()); 

// Crear rutas; 
// Rutas de prueba; 
app.get("/probando",(req,res) => {
    console.log('Ejecutando mi primera ruta'); 
    return res.status(200).json({
        texto: "Este es el primer json que devolvemos",
        property: "Segunda propiedad", 
        numero: 10
    })
})

app.get("/",(req,res) =>{
    return res.send('Iniciando la API'); 
})



// RUTAS REALES; 
const rutasArticulo = require('./Routes/article'); 

// Carga de las rutas; 
app.use("/api",rutasArticulo); 




// Crear el servidor y escuchar las peticiones http; 
const puerto = 3900; 

app.listen(puerto, ()=>{
    console.log('Servidor corriendo en el puerto ' + puerto);
}) // Ya se puede ver en la peticion al puerto que el servidor esta funcional;