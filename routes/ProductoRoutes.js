const express = require('express');

const router = express.Router();

const ProductoController=require("../controllers/ProductoController");

router.post('/nuevo', ProductoController.CrearNuevoProducto); 
router.put('/modificar', ProductoController.ModificarProducto); 
router.get('/verTodos' , ProductoController.RecuperarProductos); 
router.get('/buscar' , ProductoController.BuscarProductos); 
router.get('/verDetalle' , ProductoController.DetalleProducto);  
router.delete('/borrar' , ProductoController.BorrarProducto); 

module.exports = router;
