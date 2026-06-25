const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'patogenosdb',
  charset: 'utf8mb4',
  timezone: 'local'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
    return;
  }
  // Forzar UTF-8 en la sesión para corregir acentos y ñ
  db.query("SET NAMES 'utf8mb4'");
  db.query("SET CHARACTER SET utf8mb4");
  console.log('Conectado a la base de datos (UTF-8 activo)');
});

module.exports = db;
