const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require("./configs/dotenv");
const productosRoutes = require('./routes/ProductoRoutes');
const preciosRoutes = require('./routes/PreciosRoutes');
const port = process.env.PORT || 3000;
app.use(express.urlencoded());
app.use(express.json());
app.use(bodyParser.json());


// Add route code Here
app.get('/', (req, res) => {
   res.send('Welcome to Our web');
});

app.use('/productos', productosRoutes);
app.use('/precios', preciosRoutes);
app.use(function(req, res){
   res.redirect('/'); //aqui enviar la excepcion de servidor y/o el de una pagina por defecto
});
app.listen(port, () => {
   console.log(`We are live at 127.0.0.1:${port}`);
});

module.exports = app;