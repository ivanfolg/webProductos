const { pool } = require("../configs/db");
const ProductoDTO = require("../DTOs (modelo)/ProductoDTO");

module.exports = class ProductoDAOImplement {
    static async crear(ProdDTO){
        //console.log("añadiendo nuevo producto, estamos en DAO");
        const data = {
            nombre : ProdDTO.nombre,
            kcal : ProdDTO.kcal,
            grasas : ProdDTO.grasas,
            grasas_sat : ProdDTO.grasas_sat,
            hidratos : ProdDTO.hidratos,
            azucares : ProdDTO.azucares,
            proteinas : ProdDTO.proteinas,
            fibra : ProdDTO.fibra,
            sal : ProdDTO.sal,
            descripcion : ProdDTO.descripcion
        }
        const query = 'INSERT INTO productos(nombre, kcal, grasas, grasas_sat, hidratos, azucares, proteinas,'+
            ' fibra, sal, descripcion) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *';
        const values = [data.nombre, data.kcal, data.grasas, data.grasas_sat, data.hidratos, data.azucares, 
            data.proteinas, data.fibra, data.sal, data.descripcion];
        let result = await pool.query(query, values);
        let prod = new ProductoDTO(result.rows[0]);
        prod.id = result.rows[0].id;
        return prod;
    }

    static async modificar(ProdDTO){
        //console.log("modificando producto, estamos en DAO");
        const query = 'UPDATE productos SET nombre = \''+ ProdDTO.nombre +'\', kcal =  '+ ProdDTO.kcal +', grasas = '+ 
            ProdDTO.grasas +',grasas_sat = ' + ProdDTO.grasas_sat +',hidratos = '+ ProdDTO.hidratos +
            ',azucares = '+ ProdDTO.azucares +',proteinas = '+ ProdDTO.proteinas +',fibra = '+ ProdDTO.fibra +',sal = '+ ProdDTO.sal +
            ',descripcion = \''+ ProdDTO.descripcion +'\' WHERE productos.id='+ ProdDTO.id +' returning *';

        let result = await pool.query(query);
        let prod = new ProductoDTO(result.rows[0]);
        prod.id = result.rows[0].id;
        return prod;
    }

    //recuperar todos los productos de la bbdd
    static async recuperar(numItems, page){
        let query;
        if(numItems && page){//si los dos valores son distintos de cero --> paginacion
            query = 'SELECT * FROM productos'+ " LIMIT " + numItems + " OFFSET ((" + page + " - 1) * " + numItems + ")";
        }else{//consulta sin paginacion, todos los resultados de golpe
            query = 'SELECT * FROM productos';
        }
        let result=await pool.query(query);
        let mpd = result.rows.map(item => { 
            let prov=new ProductoDTO(item);
            prov.id=item.id;
            return prov;
        })
        return mpd;
    }

    //busca si existe un producto por su id y devuelve T/F
    static async existe(pID){
        console.log("estamos verificando que el producto existe");
        let query="select productos.id from productos where productos.id="+pID;
        let res=await pool.query(query);
        if(res.rowCount > 0) return 1;
        else return 0;
    }

    //busca si existe un producto con un nombre identico en la bbdd (duplicado) y devuelve T/F
    //esta funcion no tiene demasiado sentido por como es la app y la bbdd, aun asi se incluye ya que los nombres se meteran de forma general 
    //y no especificando marcas o tipos concretos. ej: manzanas y no manzanas- carrefour- tamaño mediano
    static async duplicado(nombre){
        console.log("estamos viendo duplicados");
        let query="select productos.id from productos where productos.nombre = '" + nombre + "'";
        let res=await pool.query(query);
        if(res.rowCount > 0) {return 1;} //hay duplicados
        else {return 0;}
    }

    //recupera los detalles de un producto concreto dado su pID
    static async verDetalle(pID){
        const query = 'SELECT * FROM productos WHERE productos.id = '+ pID;
        let result=await pool.query(query);
        return result;
    }

    //recupera los productos que tengan ciertas palabras en el nombre
    static async buscarPorPalabrasClave(arrayPalabras, numItems, page){
        //los valores de busqueda no pueden tener nada que no sea a-zA-Z0-9
        let query;
        if(numItems && page){//si los dos valores son distintos de cero --> paginacion
            query = "select * from productos where productos.nombre LIKE ANY (array[" + arrayPalabras + "]) LIMIT " + numItems + " OFFSET ((" + page + " - 1) * " + numItems + ")";
        }else{//consulta sin paginacion, todos los resultados de golpe
            query = "select * from productos where productos.nombre LIKE ANY (array[" + arrayPalabras + "])";
        }

        let result=await pool.query(query);
        let mpd = result.rows.map(item => { 
            let prov = new ProductoDTO(item);
            prov.id = item.id;
            return prov;
        })
        return mpd;
    }

    static async borrar(pID){
        const query = "DELETE FROM productos WHERE productos.id = " + pID;
        let result=await pool.query(query);
        return result;
    }


}

