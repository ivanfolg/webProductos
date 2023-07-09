module.exports = class PrecioDTO{
  
    id;
    vendedor;
    precio;
    precio_kg;
    fecha;
    fk_prod;
    descripcion;
  
    constructor(data) {
      this.vendedor = data.vendedor;
      this.precio = data.precio;
      this.precio_kg = data.precio_kg;
      this.descripcion = data.descripcion;
    }

    set setFK_Prod(pID) {
        this.fk_prod = pID;
    }

    set setID(pID){
      this.id=pID;
    }
    set setFecha(fecha){
      this.fecha=fecha;
    }

    get getID(){
      return this.id;
    }
  }