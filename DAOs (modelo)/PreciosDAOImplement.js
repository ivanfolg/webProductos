const { pool } = require("../configs/db");
const PrecioDTO = require("../DTOs (modelo)/PrecioDTO");

module.exports = class PreciosDAOImplement {
    static async crear(data){
        //console.log("añadiendo nuevo precio, estamos en DAO");
        const query = 'INSERT INTO precios(vendedor, precio, precio_kg, descripcion, fecha, fk_prod) VALUES($1,$2,$3,$4,$5,$6) RETURNING *';
        const values = [data.vendedor, data.precio, data.precio_kg, data.descripcion, data.fecha, data.fk_prod];
        let result = await pool.query(query, values);
        let precio = new PrecioDTO(result.rows[0]);
        precio.id = result.rows[0].id;
        precio.fecha=this.conversorFecha(result.rows[0].fecha);//convertir fecha pq el formato completo no es necesario
        precio.fk_prod = result.rows[0].fk_prod;
        return precio;
    }

    static async modificar(precioDTO){
        //console.log("modificando precio, estamos en DAO ");
        const query = 'UPDATE precios SET vendedor = \''+ precioDTO.vendedor +'\', precio =  '+ precioDTO.precio +', precio_kg = '+ 
            precioDTO.precio_kg +',fecha = \'' + precioDTO.fecha +
            '\',descripcion = \''+ precioDTO.descripcion +'\' WHERE precios.id='+ precioDTO.id +' returning *';
        //chequear este res y lo que sea que devuelva la query
        let result = await pool.query(query);
        let precio = new PrecioDTO(result.rows[0]);
        precio.id = result.rows[0].id;
        precio.fecha=this.conversorFecha(result.rows[0].fecha);//convertir fecha pq el formato completo no es necesario 
        precio.fk_prod = result.rows[0].fk_prod;
        return precio;
    }

    static conversorFecha(yourDate){
        const offset = yourDate.getTimezoneOffset();//convertir fecha pq el formato completo no es necesario 
        yourDate = new Date(yourDate.getTime() - (offset*60*1000));
        return yourDate.toISOString().split('T')[0];
    }

    //recuperar todos los precios de un producto de la bbdd
    static async recuperar(numItems=0, page=0, productoID){
        //console.log("recuperando todos precios de producto, estamos en DAO");
        let query;
        if(numItems && page){//si los dos valores son distintos de cero --> paginacion
            query = 'SELECT * FROM precios WHERE precios.fk_prod = ' + productoID + " LIMIT " + numItems + " OFFSET ((" + page + " - 1) * " + numItems + ")";
        }else{
            query = 'SELECT * FROM precios WHERE precios.fk_prod = ' + productoID;
        }
        let result = await pool.query(query);
        let mpd = result.rows.map(item => { 
            return {
                idPrecio: item.id,
                vendedor: item.vendedor,
                precio: item.precio,
                precio_kg: item.precio_kg,
                descripcion: item.descripcion,
                idProducto: item.fk_prod,
                fecha: this.conversorFecha(item.fecha)
            }
        })
        return mpd;
    }

    static async catalogo(numItems=0, page=0, vendedor){
        //console.log("recuperando todos productos y precios de un vendedor, estamos en DAO");
        let query;
        if(numItems && page){//si los dos valores son distintos de cero --> paginacion
            query = "select pd.id as pID, pd.nombre, pd.descripcion as pDesc, foo2.id as precioID, foo2.vendedor, foo2.precio, foo2.precio_kg, foo2.descripcion as preDesc, foo2.fecha from ( "+
                "select * from (select *, ROW_NUMBER() OVER ( PARTITION BY precios.fk_prod ORDER BY precios.fecha DESC ) rn  from precios where precios.vendedor='"+vendedor+"')"+
                " as foo  where rn = 1 ) as foo2 join productos as pd on foo2.fk_prod=pd.id LIMIT " + numItems + " OFFSET ((" + page + " - 1) * " + numItems + ")";
        }else{
            query = "select pd.id as pID, pd.nombre, pd.descripcion as pDesc, foo2.id as precioID, foo2.vendedor, foo2.precio, foo2.precio_kg, foo2.descripcion as preDesc, foo2.fecha from ( "+
            "select * from (select *, ROW_NUMBER() OVER ( PARTITION BY precios.fk_prod ORDER BY precios.fecha DESC ) rn  from precios where precios.vendedor='"+vendedor+"')"+
            " as foo  where rn = 1 ) as foo2 join productos as pd on foo2.fk_prod=pd.id";
        }
        let result = await pool.query(query);
        let mpd = result.rows.map(item => { 
            return {
                idProducto: item.pid,
                nombre: item.nombre,
                descripcionProducto: item.pdesc,
                idPrecio: item.precioid,
                vendedor: item.vendedor,
                precio: item.precio,
                precio_kg: item.precio_kg,
                descripcionPrecio: item.predesc,
                fecha: this.conversorFecha(item.fecha)
            }
        })
        return mpd; 
    }

    //se mira que no se meta un precio para el mismo producto del mismo vendedor varias veces el mismo dia
    static async duplicado(vendedor, fecha, fk_prod){
        let query="select precios.id from precios where precios.vendedor = '" + vendedor + "' and precios.fk_prod="
        + fk_prod +" and precios.fecha=\'" + fecha + "\'";
        let res=await pool.query(query);
        if(res.rowCount > 0) {return 1;} //hay duplicados
        else {return 0;}
    }

    static async existe(id){
        let query="select precios.id from precios where precios.id="+id;
        let res=await pool.query(query);
        if(res.rowCount > 0) return 1;
        else return 0;
    }

    static async borrar(pID){
        const query = "DELETE FROM precios WHERE precios.id = " + pID;
        let result=await pool.query(query);
        return result;
    }

}

