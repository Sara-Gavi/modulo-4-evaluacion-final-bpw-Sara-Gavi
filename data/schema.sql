CREATE TABLE `recetas_db`.`recetas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `ingredientes` VARCHAR(45) NOT NULL,
  `instrucciones` TEXT(255) NOT NULL,
  PRIMARY KEY (`id`));


INSERT INTO recetas (nombre, ingredientes, instrucciones) 
VALUES ('Salmorejo', 'Tomates maduros, pan duro, aceite de oliva, vinagre, sal, jamón serrano, huevo duro', 'Tritura los tomates pelados junto con el pan duro, el aceite de oliva, el vinagre y la sal. Sirve frío con jamón serrano y huevo duro picado por encima.');

INSERT INTO recetas (nombre, ingredientes, instrucciones) 
VALUES ('Tortilla de Patatas', 'Patatas, huevos, cebolla, aceite de oliva, sal', 'Pela las patatas y córtalas en rodajas finas. Fríe las patatas y la cebolla en aceite de oliva hasta que estén doradas. Bate los huevos y agrégalos a las patatas. Cocina hasta que la tortilla esté cuajada por ambos lados.');

INSERT INTO recetas (nombre, ingredientes, instrucciones) 
VALUES ('Croquetas', 'Harina, leche, mantequilla, jamón serrano picado, huevo batido, pan rallado', 'En una sartén, derrite la mantequilla y añade la harina, cocinando hasta que se forme una masa. Agrega la leche caliente poco a poco hasta obtener una bechamel espesa. Añade el jamón serrano picado y deja enfriar. Forma las croquetas, pásalas por huevo batido y pan rallado, y fríelas en aceite caliente hasta que estén doradas.');