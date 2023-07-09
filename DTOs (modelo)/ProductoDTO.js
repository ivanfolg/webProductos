module.exports = class ProductoDTO{
  
    id;
    nombre;
    kcal;
    grasas;
    grasas_sat;
    hidratos;
    azucares;
    proteinas;
    fibra;
    sal;
    descripcion;
    precioInicial;
  
    constructor(data) {
      this.nombre = data.nombre;
      this.kcal = data.kcal;
      this.grasas = data.grasas;
      this.grasas_sat = data.grasas_sat;
      this.hidratos = data.hidratos;
      this.azucares = data.azucares;
      this.proteinas = data.proteinas;
      this.fibra = data.fibra;
      this.sal = data.sal;
      this.descripcion = data.descripcion;
    }

    set setPrecioInicial(preIni){
      this.precioInicial=preIni;
    }

    set setID(pID){
      this.id=pID;
    }

    get getID(){
      return this.id;
    }
  }
  