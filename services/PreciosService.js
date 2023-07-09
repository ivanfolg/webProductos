const PreciosDAOImplement = require("../DAOs (modelo)/PreciosDAOImplement");//aqui de normal seria la interfaz pero no en este caso por simpleza 
const ProductoDAOImplement = require("../DAOs (modelo)/ProductoDAOImplement"); 
const {
    NotFoundException,
    DuplicateEntryException,
    //ForeignKeyViolationException,
    ValidationException,
    //UpdateFailedException,CreateFailedException
     }= require("../exceptions/dbExceptions");
const Joi = require('joi');
const JoiDate= require("@joi/date");
const PrecioDTO = require("../DTOs (modelo)/PrecioDTO");

const JoiExtended = Joi.extend(JoiDate);

module.exports = class PreciosService{

    static async CrearNuevoPrecio(req){
        //console.log(req);
        const schema = Joi.object().keys({ 
            vendedor: Joi.string().max(100).required(),
            precio: Joi.number().positive().required(),
            fecha: JoiExtended.date().format("YYYY-MM-DD").required(),
            precio_kg: Joi.number().positive().default(0),
            fk_prod: Joi.number().positive().required(), //foranea de producto
            descripcion: Joi.string().allow('').max(500).default(''),
            id: Joi.any()
        });
        console.log(req.fecha);
        const {error, value} = schema.validate(req);
        console.log(error,value);
        if (error) {
            return new ValidationException(error.details[0].message);
        }
        //verificamos que exista el producto para el cual se quiere añadir el precio
        let existe=await ProductoDAOImplement.existe(value.fk_prod);
        if(!existe){
            return new NotFoundException('Product with id \'' + value.pID + '\' not found');
        }
        //en duplicado pasamos la fehca de req que ya ha sido verificada por el formato cambiado de js al verificar
        let duplicado=await PreciosDAOImplement.duplicado(value.vendedor, req.fecha, value.fk_prod);
        if(duplicado){
            return new DuplicateEntryException('Price from vendor \'' + value.vendedor +'\' for product with id \'' + 
            value.fk_prod + '\' already exists on the specified date');
        }
        //este creado es un DTO de precio
        const creado =  await PreciosDAOImplement.crear(value);
        return creado;
    }

    static async ModificarPrecio(req){
        //console.log(req);
        const schema = Joi.object().keys({ 
            vendedor: Joi.string().max(100).required(),
            precio: Joi.number().positive().required(),
            fecha: JoiExtended.date().required().format("YYYY-MM-DD"),
            precio_kg: Joi.number().positive().default(0),
            fk_prod: Joi.any(), //foranea de producto
            descripcion: Joi.string().allow('').max(500).default(''),
            id: Joi.number().positive().required()
        });
        const {error, value} = schema.validate(req);
        if (error) {
            return new ValidationException(error.details[0].message);
        }
        //verificamos que exista el producto para el cual se quiere añadir el precio
        let existe=await PreciosDAOImplement.existe(value.id);
        if(!existe){
            return new NotFoundException('Price with id \'' + value.id + '\' not found');
        }
        let precioDTO=new PrecioDTO(value);
        precioDTO.fecha=req.fecha;//fecha la copiamos del obj req dado que la de value cambia el formato despues de validar
        precioDTO.id=value.id;
        precioDTO.fk_prod=value.fk_prod;
        //este creado es un DTO de precio
        const modif =  await PreciosDAOImplement.modificar(precioDTO);
        console.log(modif);
        return modif;
    }

    static async RecuperarPrecios(reqq, reqb){
        //verificamos que los parametros de la url sean los correctos
        const schema1 = Joi.object().keys({ 
            numItems: Joi.number().positive(), 
            page: Joi.number().positive()
        });
        const schema = Joi.object().keys({
            pID: Joi.number().integer().positive().required(),
        });
        const res = schema1.validate(reqq);
        const {error, value} = schema.validate(reqb);
        if (res.error) {  
            return new ValidationException("Page requested and number of items per page (in URL) must be positive numbers.");
        }
        if (error) {  
            return new ValidationException(error.message + " not '" + value.pID +"'");
        }
        const listaPrecios =  await PreciosDAOImplement.recuperar(res.value.numItems, res.value.page, value.pID);
        if (!listaPrecios.length) {
            return new NotFoundException('The product with id \'' + reqb.pID + '\' does not have any price history.');
        }
        return listaPrecios;
    }

    static async CatalogoVendedorPrecio(reqq, reqb){
        const schema1 = Joi.object().keys({ 
            numItems: Joi.number().positive(), 
            page: Joi.number().positive() 
        });
        const schema = Joi.object().keys({
            vendedor: Joi.string().max(100).required(),
        });
        const res = schema1.validate(reqq);
        const {error, value} = schema.validate(reqb);
        if (res.error) {  
            return new ValidationException("Page requested and number of items per page (in URL) must be positive numbers.");
        }
        if (error) {  
            return new ValidationException(error.message + " not '" + value.vendedor +"'");
        }
        const catalogo =  await PreciosDAOImplement.catalogo(res.value.numItems, res.value.page, value.vendedor);
        if (!catalogo.length) {
            return new NotFoundException('Store \'' + value.vendedor + '\' does not exist or has no products.');
        }
        return catalogo;
    }

    static async BorrarPrecio(req){
        const schema = Joi.object().keys({
            pID: Joi.number().integer().positive().required(),
        });
        const {error, value} = schema.validate(req);
        if (error) {  
            return new ValidationException(error.message + " not '" + value.pID +"'");
        }
        const borrado =  await PreciosDAOImplement.borrar(req.pID);
        if(borrado.rowCount > 0)
            return {message: 'Price with id \'' + req.pID + '\' deleted.'}
        else return new NotFoundException('Price with id \'' + req.pID + '\' not found');
    }
}
