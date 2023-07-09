const express = require('express');
const router = express.Router();

const PreciosController=require("../controllers/PreciosController");

router.post('/nuevo', PreciosController.CrearNuevoPrecio); 
router.put('/modificar', PreciosController.ModificarPrecio);
router.get('/verTodos' , PreciosController.RecuperarPrecios); 
router.get('/verCatalogo' , PreciosController.CatalogoVendedorPrecio);
router.delete('/borrar' , PreciosController.BorrarPrecio); 

module.exports = router;