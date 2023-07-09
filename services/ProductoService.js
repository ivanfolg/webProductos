const ProductoDTO = require("../DTOs (modelo)/ProductoDTO");
const ProductoDAOImplement = require("../DAOs (modelo)/ProductoDAOImplement");//aqui de normal seria la interfaz pero no en este caso por simpleza 
const {
    NotFoundException,
    DuplicateEntryException,
    //ForeignKeyViolationException, esto aqui no afecta afectaria a posibles listas de la compra/menus pero no a precios o productos ya que se borra en cascada
    ValidationException,
    //UpdateFailedException,CreateFailedException
    }= require("../exceptions/dbExceptions");
const Joi = require('joi');
const PreciosService = require("./PreciosService");
const PrecioDTO = require("../DTOs (modelo)/PrecioDTO");

module.exports = class ProductoService{

    static async CrearNuevoProducto(req){
        //console.log(req);
        const schema = Joi.object().keys({ 
            nombre: Joi.string().max(100).required(),
            kcal: Joi.number().positive().allow(0).default(0),
            grasas: Joi.number().positive().allow(0).default(0),
            grasas_sat: Joi.number().positive().allow(0).default(0),
            hidratos: Joi.number().positive().allow(0).default(0),
            azucares: Joi.number().positive().allow(0).default(0),
            proteinas: Joi.number().positive().allow(0).default(0),
            fibra: Joi.number().positive().allow(0).default(0),
            sal: Joi.number().positive().allow(0).default(0),
            descripcion: Joi.string().allow('').max(500).default(''),
            precio: Joi.any() //aqui se permite todo ya que se verifica mas adelante
        });
        const {error, value} = schema.validate(req);
        if (error) {
            return new ValidationException(error.details[0].message);
        }

        //verificar que no exista el producto en este caso que no exista con el mismo nombre exacto, puede haber parecidos
        let existe=await ProductoDAOImplement.duplicado(value.nombre);
        if(existe){
            return new DuplicateEntryException('Product \'' + value.nombre + '\' already exists');
        }
        //creado es un dto de producto con todos los campos colocados excepto el precio inicial
        const creado =  await ProductoDAOImplement.crear(new ProductoDTO(value));
        // una vez creado el producto creamos el precio inicial del mismo
        let nuevoPrecio = new PrecioDTO(req.precio);//el elemento precio del json del body
        nuevoPrecio.fk_prod = creado.id;
        nuevoPrecio.fecha=req.precio.fecha;
        creado.precioInicial = await PreciosService.CrearNuevoPrecio(nuevoPrecio); 
        return creado; //vuelve en formato DTO
    }
    static async ModificarProducto(req){
        //console.log(req);
        const schema = Joi.object().keys({ 
            pID: Joi.number().integer().positive().required(),
            nombre: Joi.string().max(100).allow(0).required(),
            kcal: Joi.number().positive().allow(0).required(),
            grasas: Joi.number().positive().allow(0).required(),
            grasas_sat: Joi.number().positive().allow(0).required(),
            hidratos: Joi.number().positive().allow(0).required(),
            azucares: Joi.number().positive().allow(0).required(),
            proteinas: Joi.number().positive().allow(0).required(),
            fibra: Joi.number().positive().allow(0).required(),
            sal: Joi.number().positive().allow(0).required(),
            descripcion: Joi.string().allow('').max(500).required(),
        });
        const {error, value} = schema.validate(req);
        if (error) {
            return new ValidationException(error.details[0].message);
        }

        //verificar que el producto exista en la base de datos buscar por id y error si no aparece
        let existe=await ProductoDAOImplement.existe(value.pID);
        if(!existe){
            return new NotFoundException('Product with id \'' + value.pID + '\' not found');
        }
        let datosProd=new ProductoDTO(value);
        datosProd.id=value.pID;
        const modificado =  await ProductoDAOImplement.modificar(datosProd);
                
        return modificado; //vuelve en formato DTO
    }

    static async RecuperarProductos(req){
        const schema = Joi.object().keys({ 
            numItems: Joi.number().positive().allow(0).default(0), //solo letras números y espacios
            page: Joi.number().positive().allow(0).default(0) //solo letras números y espacios
        });
        const {error, value} = schema.validate(req);
        if (error) {
            return new ValidationException("Page requested and number of items per page must be positive numbers.");
        }
        const listaProductos =  await ProductoDAOImplement.recuperar(value.numItems, value.page);
        if (!listaProductos.length) {
            return new NotFoundException('Database empty, no products found.');
        }
        return listaProductos;
    }

    static async BuscarProductos(reqq, reqb){
        //verificamos que los parametros de la url sean los correctos
        const schema1 = Joi.object().keys({ 
            numItems: Joi.number().positive().allow(0).default(0), 
            page: Joi.number().positive().allow(0).default(0) 
        });
        //verificar y separar todas las palabras en un array
        const schema2 = Joi.object().keys({ 
            busqueda: Joi.string().regex(/^[a-zA-Z0-9 ]*$/).required() //solo letras números y espacios
        });
        let resq = schema1.validate(reqq);
        let resb = schema2.validate(reqb);

        if (resq.error) {
            return new ValidationException("Page requested and number of items per page (in URL) must be positive numbers.");
        }
        if (resb.error) {
            return new ValidationException("El texto de búsqueda debe contener solamente letras, números y espacios (sin tildes).");
        }
        
        let palabras=reqb.busqueda.split(' ');
        let palabras2=[]; //tambien metodos padStart y padEnd para meter los % pero podria no ir bien en navegador
        palabras.forEach(p => {
            palabras2.push(
                "'%".concat(p.concat("%'"))
            );
        });
        const listaProductos =  await ProductoDAOImplement.buscarPorPalabrasClave(palabras2, resq.value.numItems, resq.value.page);
        if (!listaProductos.length) {
            return new NotFoundException('No products found.');
        }
        return listaProductos; 
    }

    static async DetalleProducto(req){
        const schema = Joi.object().keys({
            pID: Joi.number().integer().positive().required(),
        });
        const {error, value} = schema.validate(req);
        if (error) {  
            return new ValidationException(error.message + " not '" + value.pID +"'");
        }
        const prod =  await ProductoDAOImplement.verDetalle(req.pID);
        if (!prod.rowCount) {
            return new NotFoundException('Product with id \'' + req.pID + '\' not found');
        }else{
            return prod.rows[0];
        }
    }

    static async BorrarProducto(req, res){
        const schema = Joi.object().keys({
            pID: Joi.number().integer().positive().required(),
        });
        const {error, value} = schema.validate(req);
        if (error) {  
            return new ValidationException(error.message + " not '" + value.pID +"'");
        }
        const borrado =  await ProductoDAOImplement.borrar(req.pID);
        if(borrado.rowCount > 0)
            return {message: 'Product with id \'' + req.pID + '\' deleted.'}
        else return new NotFoundException('Product with id \'' + req.pID + '\' not found');
    }
}
