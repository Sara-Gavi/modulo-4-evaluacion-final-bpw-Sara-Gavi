//IMPORTAR BIBLIOTECAS

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mysql = require("mysql2/promise");

//CREAR VARIABLES
const app = express();
const port = 4000;

//CONFIGURACIÓN EXPRESS

app.use(cors());
app.use(express.json({ limit: "25Mb" }));

// CONFIGURACIÓN MYSQL

const getConnection = async () => {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_SCHEMA || "recetas_db",
  });

  await connection.connect();

  console.log(
    `conexion establecida con la base de datos (identificador=${connection.threadId})`
  );
  return connection;
};

// ARRANCAR

app.listen(port, () => {
  console.log(`Server has benn started in <http://localhost:${port}>`);
});

// ENDPOINTS

// 1.Obtener todas las recetas
app.get("/api/recetas", async (req, res) => {
  try {
    // Establecer conexión con la base de datos
    const conn = await getConnection();

    // Consulta SQL para obtener todas las recetas
    const queryGetRecetas = `
      SELECT * FROM recetas;
    `;

    // Hacer la consulta
    const [results, fields] = await conn.query(queryGetRecetas);

    // Obtener el número de elementos
    const count = results.length;

    // Cerrar la conexión con la base de datos
    conn.end();

    // Crear objeto de respuesta
    const response = {
      info: {
        count: count,
      },
      results: results,
    };

    // Enviar respuesta a la usuaria
    res.json(response);
  } catch (error) {
    res.json({
      success: false,
      error: "UPS! ha ocurrido un error",
    });
  }
});

// 2.Endpoint para obtener una receta por su ID

app.get("/api/recetas/:id", async (req, res) => {
  try {
    // Conectar con la base de datos
    const conn = await getConnection();

    // Consulta SQL para obtener la receta con el ID
    const queryGetReceta = `
      SELECT * FROM recetas WHERE id = ?;
    `;

    // Hacer la consulta SQL con el ID proporcionado en los parámetros de la solicitud
    const [receta] = await conn.query(queryGetReceta, [req.params.id]);

    // comprobar si se encontró una receta con ese ID
    if (receta.length === 0) {
      // Si no se encuentra la receta, enviar una respuesta de código 404 y un mensaje de error
      res.status(404).json({ error: " Oh! No hemos encontrado tu receta" });
      return;
    }

    // Si se encontró la receta, enviarla como respuesta en formato JSON
    res.json(receta[0]);
  } catch (error) {
    res.json({
      success: false,
      error: "UPS! ha ocurrido un error",
    });
  }
});

// 3.Endpoint para agregar nueva receta

app.post("/api/recetas", async (req, res) => {
  try {
    // Verificar si la solicitud contiene todos los campos que son necesarios
    if (!req.body.nombre || !req.body.ingredientes || !req.body.instrucciones) {
      res.status(400).json({
        success: false,
        message: "¡HEY! Todos los campos son obligatorios",
      });
      return;
    }

    const conn = await getConnection();

    // Query para insertar una nueva receta en la base de datos
    const insertReceta = `
      INSERT INTO recetas (nombre, ingredientes, instrucciones) VALUES (?, ?, ?)
    `;

    // Hacer la consulta para insertar la nueva receta
    const [insertResult] = await conn.execute(insertReceta, [
      req.body.nombre,
      req.body.ingredientes,
      req.body.instrucciones,
    ]);

    conn.end();

    // Responder con exito y el ID de la nueva fila insertada
    res.json({
      success: true,
      id: insertResult.insertId,
      message: "¡Bien! Nueva receta",
    });
  } catch (error) {
    res.json({
      success: false,
      error: "UPS! ha ocurrido un error",
    });
  }
});

// 4.Endpoint para actualizar una receta existente

app.put("/api/recetas/:id", async (req, res) => {
  try {
    const conn = await getConnection();

    const updateReceta = `
      UPDATE recetas
      SET nombre = ?, ingredientes = ?, instrucciones = ?
      WHERE id = ?
    `;

    const [updateResult] = await conn.execute(updateReceta, [
      req.body.nombre,
      req.body.ingredientes,
      req.body.instrucciones,
      req.params.id,
    ]);

    conn.end();

    if (updateResult.affectedRows === 0) {
      res.status(404).json({
        success: false,
        error:
          "¡Ups! No hemos encontrado la receta o no se ha podido actualizar",
      });
      return;
    }

    res.json({
      success: true,
      message: "¡Bien! receta actualizada",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "UPS! ha ocurrido un error",
    });
  }
});

// 5.Endpoint para eliminar una receta
app.delete("/api/recetas/:id", async (req, res) => {
  try {
    const conn = await getConnection();

    const deleteReceta = `
      DELETE FROM recetas WHERE id = ?
    `;

    const [deleteResult] = await conn.execute(deleteReceta, [req.params.id]);

    conn.end();

    if (deleteResult.affectedRows === 0) {
      res
        .status(404)
        .json({ success: false, error: "¡Ups! No hemos encontrado la receta" });
      return;
    }
    res.json({
      success: true,
      message: "¡Adiós receta!",
    });
  } catch (error) {
    res.json({
      success: false,
      error: "UPS! ha ocurrido un error",
    });
  }
});
