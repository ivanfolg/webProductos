Un proyecto personal muy básico para aprender Nodejs, express y postgresql

Tenemos productos (de alimentación) con su información nutricional y los precios de los mismos 
productos 1---N precios 

* * *
## Productos:
- **Crear producto**: ip:port/productos/nuevo
INPUT: los datos para crear el nuevo producto así como los datos del precio inicial del mismo
BODY -> json:
```
{
    "nombre": "alphanumeric",
    "kcal": number,
    "grasas": number,
    "grasas_sat": number,
    "hidratos": number,
    "azucares": number,
    "proteinas": number,
    "fibra": number,
    "sal": number,
    "descripcion": "alphanumeric",
    "precio": {
        "vendedor": "alphanumeric",
        "precio": number,
        "precio_kg": number,
        "fecha": "YYYY-MM-DD",
        "descripcion": "alphanumeric"
    }
}
```

OUTPUT: 
Error al crear el producto:
```
{
    "message": "error message",
    "errorCode": XXX,
    "status": "Bad request/Not Found..."
}
``` 
O información del nuevo producto creado (y el precio inicial del mismo si se ha creado sin errores)
```
{
    "id": number,
    "nombre": "alphanumeric",
    "kcal": number,
    "grasas": number,
    "grasas_sat": number,
    "hidratos": number,
    "azucares": number,
    "proteinas": number,
    "fibra": number,
    "sal": number,
    "descripcion": "alphanumeric",
	"precioInicial": {
        "id": number,
        "vendedor": "alphanumeric",
        "precio": number,
        "precio_kg": number,
        "fecha": "YYYY-MM-DD",
        "fk_prod": number,
        "descripcion": "alphanumeric"
    }
}
```
   O el producto creado correctamente y los errores si no se se ha creado el precio:
```
{
    "id": number,
    "nombre": "alphanumeric",
    "kcal": number,
    "grasas": number,
    "grasas_sat": number,
    "hidratos": number,
    "azucares": number,
    "proteinas": number,
    "fibra": number,
    "sal": number,
    "descripcion": "alphanumeric",
	"precioInicial": {
        "message": "error message",
        "errorCode": XXX,
        "status": "Bad request"
    } 
}
```

- **Modificar producto:** ip:port/productos/modificar
INPUT: los datos completos del producto
BODY -> json:
```
{
	"pID": number,
    "nombre": "alphanumeric",
    "kcal": number,
    "grasas": number,
    "grasas_sat": number,
    "hidratos": number,
    "azucares": number,
    "proteinas": number,
    "fibra": number,
    "sal": number,
    "descripcion": "alphanumeric"
}
```
OUTPUT:
```
{
	"pID": number,
    "nombre": "alphanumeric",
    "kcal": number,
    "grasas": number,
    "grasas_sat": number,
    "hidratos": number,
    "azucares": number,
    "proteinas": number,
    "fibra": number,
    "sal": number,
    "descripcion": "alphanumeric"
}
```
- **Ver detalles de un producto**: ip:port/productos/verDetalle
INPUT: el identificador del producto
BODY -> json:
```
{
	"pID": number
}
```
OUTPUT:
```
{
	"pID": number,
    "nombre": "alphanumeric",
    "kcal": number,
    "grasas": number,
    "grasas_sat": number,
    "hidratos": number,
    "azucares": number,
    "proteinas": number,
    "fibra": number,
    "sal": number,
    "descripcion": "alphanumeric"
}
```
- **Ver todos los productos**: ip:port/productos/verTodos
INPUT: opcionalmente el número de productos (entero positivo) que se recuperarán por página y el número de página (entero positivo), si no están presentes se recuperan todos los productos de la BBDD
URL ...?numItems=*number*&page=*number*
OUTPUT: lista de productos
```
[
	{
		"pID": number,
		"nombre": "alphanumeric",
		"kcal": number,
		"grasas": number,
		"grasas_sat": number,
		"hidratos": number,
		"azucares": number,
		"proteinas": number,
		"fibra": number,
		"sal": number,
		"descripcion": "alphanumeric"
	},
	...
	
]
```
- **Buscar productos por nombre**: ip:port/productos/buscar
INPUT: 
BODY -> json:
```
{
	"busqueda": "alphanumeric"
}
```

Opcionalmente el número de productos (entero positivo) que se recuperarán por página y el número de página (entero positivo), si no están presentes se recuperan todos los productos que coincidan con la búsqueda
URL ...?numItems=*number*&page=*number*
OUTPUT: lista de productos
```
[
	{
		"pID": number,
		"nombre": "alphanumeric",
		"kcal": number,
		"grasas": number,
		"grasas_sat": number,
		"hidratos": number,
		"azucares": number,
		"proteinas": number,
		"fibra": number,
		"sal": number,
		"descripcion": "alphanumeric"
	},
	...
	
]
```
- **Borrar un producto**: ip:port/productos/borrar
INPUT: el identificador del producto a borrar
BODY -> json:
```
{
	"pID": number
}
```
OUTPUT:
En caso de borrado con éxito
Nota: al borrar un producto se produce un borrado en cascada que borra todos los precios registrados del producto.
```
{
    "message": "Product with id 'X' deleted."
}
```
En caso de error
```
{
    "message": "Product with id 'X' not found",
    "errorCode": 404,
    "status": "Not found."
}
```

* * *
## Precios:
- **Crear precio:** ip:port/precios/nuevo
INPUT: los datos del precio a crear, así como el identificador del producto para el que se está creando el precio
BODY -> json
```
{
    "vendedor": "alphanumeric",
    "precio": number,
    "precio_kg": number,
    "fecha": "YYYY-MM-DD",
    "descripcion": "alphanumeric",
	"fk_prod": number
}
```
OUTPUT:
```
{
	"id":number,
    "vendedor": "alphanumeric",
    "precio": number,
    "precio_kg": number,
    "fecha": "YYYY-MM-DD",
    "descripcion": "alphanumeric",
	"fk_prod": number
}
```
O los errores al crear el precio:
```
{
    "message": "text",
    "errorCode": XXX,
    "status": "text."
}
```
- **Modificar precio**: ip:port/precios/modificar
INPUT:
BODY -> json
```
{
	"id":number,
    "vendedor": "alphanumeric",
    "precio": number,
    "precio_kg": number,
    "fecha": "YYYY-MM-DD",
    "descripcion": "alphanumeric",
	"fk_prod": number
}
```
OUTPUT:
```
{
	"id":number,
    "vendedor": "alphanumeric",
    "precio": number,
    "precio_kg": number,
    "fecha": "YYYY-MM-DD",
    "descripcion": "alphanumeric",
	"fk_prod": number
}
```
O los errores al crear el precio:
```
{
    "message": "text",
    "errorCode": XXX,
    "status": "text."
}
```
- **Ver todos los precios de un producto**: ip:port/precios/verTodos
INPUT: el identificador del producto
BODY -> json:
```
{
	"pID": number
}
```
Opcionalmente el número de precios (entero positivo) que se recuperarán por página y el número de página (entero positivo), si no están presentes se recuperan todos los precios que coincidan con la búsqueda
URL ...?numItems=*number*&page=*number*
OUTPUT: lista de precios
```
[
	{
		"id":number,
		"vendedor": "alphanumeric",
		"precio": number,
		"precio_kg": number,
		"fecha": "YYYY-MM-DD",
		"descripcion": "alphanumeric",
		"fk_prod": number
	}
	...
]
```

- **Ver catálogo de un vendedor/tienda concreto:** ip:port/precios/verCatalogo
INPUT: el vendedor
BODY -> json:
```
{
	"vendedor": "alphanumeric"
}
```
Opcionalmente el número de resultados (entero positivo) que se recuperarán por página y el número de página (entero positivo), si no están presentes se recuperan todos los productos del vendedor
URL ...?numItems=*number*&page=*number*
OUTPUT: lista de productos con su precio más reciente y la fecha del mismo
```
[
    {
        "idProducto": number,
        "nombre": "alphanumeric",
        "descripcioProducto": "alphanumeric",
        "idPrecio": number,
        "vendedor": "alphanumeric",
        "precio": number,
        "precio_kg": number,
        "descripcionPrecio": "alphanumeric",
        "fecha": "YYYY-MM-DD"
    },
...
]
```
- **Borrar un precio**: ip:port/precios/borrar
INPUT: el identificador del precio a borrar
BODY -> json:
```
{
	"pID": number
}
```
OUTPUT:
En caso de borrado con éxito
```
{
    "message": "Price with id 'X' deleted."
}
```
En caso de error
```
{
    "message": "Price with id 'X' not found",
    "errorCode": 404,
    "status": "Not found."
}
```