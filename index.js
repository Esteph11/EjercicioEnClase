const express = require('express');
const app = express();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const SECRET_KEY = 'MiClaveSecreta';
const PORT = 3005;

const conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Puchito201524',
    database:'db_usuarios'
});

conexion.connect((err) => {
    if(err){
        console.error('Error de conexión a la base de datos',err);
    }else{
        console.log('Conexión exitosa...');
    }
});

// Middleware para autenticación JWT, Seguridad en las API's
const verificarToken=(req, res, next) =>{
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(401).json({mensaje:'Token no proporcionado'});
    } 
    
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user)=>{
        if(err){
            return res.status(403).json({mensaje: 'Token inválido o expirado'});
        }

        req.user = user;
        next();
    });

};

app.use(express.json());
app.use(cors());

app.use((err, req, res, next) => {  
    console.error(err.stack); 
    res.status(500).send('Algo salió mal en el servidor.');  
});

app.post('/login', (req, res) =>{
    const {username, password} = req.body;
   
    if(username === 'admin' && password === '1234'){
        const token = jwt.sign({username}, SECRET_KEY, {expiresIn: '1h'});
        return res.status(200).json({ mensaje: "Autenticación exitosa", token });  
    }  
    if (err) {  
        res.status(401).json({mensaje: 'Credenciales inválidas'});
    }  
    else{
        return res.status(500).json({mensaje: 'Error en el servidor'}); 
    }
});

app.get('/', (req, res) => {
  res.send('¡Hola Mundo desde Express.js!');
});
/*
app.get('/usuarios', verificarToken, (req, res)=>{
    let lastUser = usuarios[usuarios.length-1]
    res.json(lastUser.id + 1);
    
    if (err) {  
        return res.status(500).json({ mensaje: "Error al obtener los usuarios" });  
    }  
    return res.status(200).json({ mensaje: "Usuarios obtenidos con éxito", usuarios: rows });  
});

app.post('/usuarios', verificarToken, (req,res)=>{
    let usuario = req.body;
    usuarios.push(usuario);
    if (err) {  
        return res.status(500).json({ mensaje: "Error al registrar el usuario" });  
    }  
    return res.status(201).json({ mensaje: "Usuario registrado con éxito", usuario: { id: this.lastID, username } });  
});   
*/
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
