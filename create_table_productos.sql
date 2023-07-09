CREATE TABLE IF NOT EXISTS
      productos(
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(128) NOT NULL,
        kcal FLOAT NOT NULL,
		    grasas FLOAT NOT NULL,
        grasas_sat FLOAT NOT NULL,
        hidratos FLOAT NOT NULL,
        azucares FLOAT NOT NULL,
        proteinas FLOAT NOT NULL,
        fibra FLOAT NOT NULL,
        sal FLOAT NOT NULL,
        descripcion VARCHAR(512)
      )