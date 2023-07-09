const ProductoService = require("../services/ProductoService");
const {
    InternalServerException,
    //InvalidEndpointException
 }= require("../exceptions/serviceExceptions");
module.exports = class ProductoController{

    static async CrearNuevoProducto(req, res){
        try {
            const creado =  await ProductoService.CrearNuevoProducto(req.body);
            if(creado instanceof Error){
                res.status(creado.errorCode);
            }else{
                res.status(200);
            }
            res.json(creado);
         } catch (error) {
            //console.log(error);
            res.status(500).json(new InternalServerException());
         }
    }

    static async ModificarProducto(req, res){
        try {
            const modificado =  await ProductoService.ModificarProducto(req.body);
            if(modificado instanceof Error){
                res.status(modificado.errorCode);
            }else{
                res.status(200);
            }
            res.json(modificado);
         } catch (error) {
            //console.log(error);
            res.status(500).json(new InternalServerException());
         }
    }

    static async RecuperarProductos(req, res){
        try {
            const listaProductos =  await ProductoService.RecuperarProductos(req.query);
            if(listaProductos instanceof Error){
                res.status(listaProductos.errorCode);
            }else{
                res.status(200);
            }
            res.json(listaProductos);
        } catch (error) {
            //console.log(error);
            res.status(500).json(new InternalServerException());
        }
    }

    static async BuscarProductos(req, res){
        try {
            const listaProductos =  await ProductoService.BuscarProductos(req.query, req.body);
            if(listaProductos instanceof Error){
                res.status(listaProductos.errorCode);
            }else{
                res.status(200);
            }
            res.json(listaProductos);
        } catch (error) {
            //console.log(error);
            res.status(500).json(new InternalServerException());
        }
    }

    static async DetalleProducto(req, res){
        try {
            const respuesta =  await ProductoService.DetalleProducto(req.body);
            if(respuesta instanceof Error){
                res.status(respuesta.errorCode);
            }else{
                res.status(200); 
            }
            res.json(respuesta);
        } catch (error) {
            res.status(500).json(new InternalServerException());
        }
    }

    static async BorrarProducto(req, res){
        try {
            const respuesta =  await ProductoService.BorrarProducto(req.body);
            if(respuesta instanceof Error){
                res.status(respuesta.errorCode)
            }else{
                res.status(200); 
            }
            res.json(respuesta);
        } catch (error) {
            res.status(500).json(new InternalServerException());
        }
    }
    
}
