const mongoose = require("mongoose"); 

const connect = async () => {
    try{

        const db = 'mi_blog'; 
        await mongoose.connect(`mongodb://localhost:27017/${db}`); 

        // Posibles paramentros para detectar errores; 
        // useNewUrlParse: true; 
        // useUnifiedTopology: true; 
        // useCreateIndex: true; 

        console.log('Conexion realizada exitosamente con la db: '+db); 
        
    }catch(error){
        console.log(error);
        throw new Error('No se ha podido realizar la conexion con la base de datos'); 
    }
}

module.exports = {
    connect
}