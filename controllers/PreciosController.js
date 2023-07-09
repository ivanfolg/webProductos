const PreciosService = require("../services/PreciosService");
const {
    InternalServerException,
    //InvalidEndpointException
 }= require("../exceptions/serviceExceptions");

module.exports = class PreciosController{

    static async CrearNuevoPrecio(req, res){
        try {
            const creado =  await PreciosService.CrearNuevoPrecio(req.body);
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

    static async ModificarPrecio(req, res){
        try {
            const modificado =  await PreciosService.ModificarPrecio(req.body);
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

    static async RecuperarPrecios(req, res){
        try {
            const listaPrecios =  await PreciosService.RecuperarPrecios(req.query, req.body);
            if(listaPrecios instanceof Error){
                res.status(listaPrecios.errorCode);
            }else{
                res.status(200);
            }
            res.json(listaPrecios);
        } catch (error) {
            //console.log(error);
            res.status(500).json(new InternalServerException());
        }
    }

    static async CatalogoVendedorPrecio(req, res){
        try {
            const catalogo =  await PreciosService.CatalogoVendedorPrecio(req.query, req.body);
            if(catalogo instanceof Error){
                res.status(catalogo.errorCode);
            }else{
                res.status(200);
            }
            res.json(catalogo);
        } catch (error) {
            console.log(error);
            res.status(500).json(new InternalServerException());
        }
    }

    static async BorrarPrecio(req, res){
        try {
            const respuesta =  await PreciosService.BorrarPrecio(req.body);
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