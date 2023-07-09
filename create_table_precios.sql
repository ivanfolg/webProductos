CREATE TABLE IF NOT EXISTS
      precios(
        id SERIAL PRIMARY KEY,
        vendedor VARCHAR(128) NOT NULL,
        precio FLOAT NOT NULL,
		precio_kg FLOAT NOT NULL,
        descripcion VARCHAR(512),
		fecha DATE NOT NULL,
		CONSTRAINT fk_producto
    		FOREIGN KEY(id) 
      			REFERENCES productos(id)
      )